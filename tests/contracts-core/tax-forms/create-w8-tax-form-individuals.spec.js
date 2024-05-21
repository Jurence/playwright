import { test } from '@playwright/test';
import taxformData from '../../../data/contracts-core/tax-form-creation';
import country from '../../../data/countries.json';
import { reviewAndSign } from '../../../helpers/contracts-core/ic-review-and-sign-ui';
import {
  assertW8BenTaxDetailsPageIndividuals,
  openTaxFormDetailsPage,
  openTaxFormFlowAndConfirmPersonalDetails,
} from '../../../helpers/contracts-core/ic-tax-form-assertions-and-shared-functions';
import {
  fillAddressForW8Forms,
  fillPersonalInformationForW8ben,
  fillTaxDetailsForW8ben,
  fillTaxTreatyForW8ben,
  selectW8benTaxForm,
  signW8TaxForm,
} from '../../../helpers/contracts-core/ic-w8-tax-form-creation';
import { loginIntoSpecificPage } from '../../../helpers/platform/login-ui';
import { closeOnboardingWidget } from '../../../helpers/shared-functions/general-functions';
import icTaxFormSelectors from '../../../selectors/ic-contracts-core/tax-forms';
import { createClient } from '../../../setup/commands/create-client';
import { createIndividualContractor } from '../../../setup/commands/create-contractor';
import createFixedContract from '../../../setup/commands/ic-contracts-core/ic-fixed-contract';
import {
  sendInvitationToContractorFromClient,
  signUpICContractWithoutTaxForms,
} from '../../../setup/commands/ic-contracts-core/ic-sign-contract';
import { password } from '../../../setup/constants';

let client;
let contractor;
let contract;
let contractorContractLink;

test.describe('Create W8-BEN Tax forms for Individuals', () => {
  test.beforeEach('Create contract, user and login via API', async ({ request }) => {
    test.setTimeout(120 * 1000);
    contractor = await createIndividualContractor({ country: country.ES.value });
    client = await createClient({ country: country.ES.value });

    const contractData = { client, contractor, contract: { rate: 100, currency: 'USD' }, creator: 'client' };
    contract = await createFixedContract(request, contractData);
    taxformData.firstName = contractor.firstName;
    taxformData.lastName = contractor.lastName;

    contractorContractLink = `contract/${contract.id}`;
  });

  test(
    'Non-US Contractor can create W8-BEN Tax form for Individuals @contract-core-qa-front',
    {
      tag: ['@slowRegression'],
    },
    async ({ page, request }) => {
      // Sign contract as Client and invite Contractor via API
      await signUpICContractWithoutTaxForms(request, contract.id, client.token, client.legalEntityId);
      await sendInvitationToContractorFromClient(request, contract.id, contractor.email, { type: null }, client.token);

      // Login as contractor
      await loginIntoSpecificPage(page, request, contractor.email, password, contractorContractLink);

      // Open Tax form flow and pass Step 1: Personal details
      await openTaxFormFlowAndConfirmPersonalDetails(page);

      // Step 2: Form selection
      await selectW8benTaxForm(page);

      // Step 3: Personal information
      await fillPersonalInformationForW8ben(page, taxformData);

      // Step 4: Address
      await fillAddressForW8Forms(page, taxformData);

      // Step 5: Tax details
      await fillTaxDetailsForW8ben(page, taxformData);

      // Step 6: Tax treaty
      await fillTaxTreatyForW8ben(page);

      // Step 7: Review & Sign
      await signW8TaxForm(page);

      // Sign as contractor
      await reviewAndSign(page);
      await closeOnboardingWidget(page);

      // Go to Tax form details page to assert the result
      await openTaxFormDetailsPage(page);
      await assertW8BenTaxDetailsPageIndividuals(page, taxformData, icTaxFormSelectors);
    }
  );
});
