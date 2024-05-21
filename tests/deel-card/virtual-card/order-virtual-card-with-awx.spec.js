import { test } from '@playwright/test';
import country from '../../../data/countries.json';
import {
  agreeTermsOfService,
  assertVirtualDeelCardCreation,
  fillReferenceNumber,
  uploadPoaDoc,
} from '../../../helpers/deel-card/ic-card-creation';
import {
  clearsOnboardingModal,
  confirmDeelCardDetails,
  dismissSuccessCardCreationModal,
  selectProofOfAddressRadioButton,
  selectVirtualDeelCard,
  setDateInCalendar,
} from '../../../helpers/deel-card/ic-reusable-methods';
import { loginIntoSpecificPage } from '../../../helpers/platform/login-ui';
import { nextStep } from '../../../helpers/shared-functions/form-functions';
import icDeelCardDetaislAndPoaUpload from '../../../selectors/deel-card/card-upload-poa';
import sharedSelectors from '../../../selectors/shared-selectors';
import { createClientWithNonUSEntity } from '../../../setup/commands/create-client';
import { createIndividualContractor } from '../../../setup/commands/create-contractor';
import createFixedContract from '../../../setup/commands/ic-contracts-core/ic-fixed-contract';
import {
  sendInvitationToContractorFromClient,
  signUpICContractWithoutTaxForms,
} from '../../../setup/commands/ic-contracts-core/ic-sign-contract';
import { password } from '../../../setup/constants';
import CardCreationData from '../../../setup/models/deel-card/ic-card-creation';
import URLS from '../../../setup/urls';

test.describe('Order a virtual deel card using awx', () => {
  let client;
  let contractor;
  let testData;

  test.beforeEach('Create users, contracts, and sign them via API', async ({ request }) => {
    test.setTimeout(120 * 1000);

    contractor = await createIndividualContractor({ country: country.ES.value });
    client = await createClientWithNonUSEntity({ country: country.ES.value });
    testData = new CardCreationData();
    const contractData = {
      client,
      contractor,
      contract: { rate: 100, currency: 'USD' },
      creator: 'client',
    };
    const contract = await createFixedContract(request, contractData);

    await signUpICContractWithoutTaxForms(request, contract.id, client.token);
    await sendInvitationToContractorFromClient(request, contract.id, contractor.email, { type: null }, client.token);
    await signUpICContractWithoutTaxForms(request, contract.id, contractor.token);
  });

  test(
    'Order a virtual card successfully via awx card issuer @payment-cards-qa-front',
    {
      tag: ['@slowRegression'],
    },
    async ({ page, request }) => {
      // Open deel card creation flow
      await loginIntoSpecificPage(page, request, contractor.email, password, URLS.IC_CARD_CREATION);

      // Clicks and clears the onboarding modal
      await clearsOnboardingModal(page);

      // Clicks and selects virtual card
      await selectVirtualDeelCard(page);

      // Clicks and selects any of the radio buttons
      await selectProofOfAddressRadioButton(page);

      // Uploads a file for proof of address
      await uploadPoaDoc(page, sharedSelectors.uploadFileDropzone, testData.filePath);

      // Sets the date of issue in the calendar
      await setDateInCalendar(
        page,
        icDeelCardDetaislAndPoaUpload.dateOfIssueInput,
        testData.dateOfIssue,
        icDeelCardDetaislAndPoaUpload.referenceNumberInput,
        icDeelCardDetaislAndPoaUpload.dateOfIssueInput
      );

      // Fills in the reference number input field
      await fillReferenceNumber(page, testData.referenceNumber);

      // Clicks the next button to proceed to the ToS page
      await nextStep(page);

      // Accepts and clicks the terms of service checkbox
      await agreeTermsOfService(page);

      // Clicks the next button to proceed to the next step of details confirmation
      await nextStep(page);

      // Clicks the confirm details button to proceed to the cards landing page
      await confirmDeelCardDetails(page);

      // Clicks the ok button to clear the success modal and reveal the landing page
      await dismissSuccessCardCreationModal(page);

      // Final step is assertion. Ensure that the card is created and IC can see it in the cards landing page
      await assertVirtualDeelCardCreation(page);
    }
  );
});
