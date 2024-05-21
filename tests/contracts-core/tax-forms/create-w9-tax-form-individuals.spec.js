import { test } from '@playwright/test';
import taxformData from '../../../data/contracts-core/tax-form-creation';
import country from '../../../data/countries.json';
import { reviewAndSign } from '../../../helpers/contracts-core/ic-review-and-sign-ui';
import {
  assertW9TaxDetailsPageIndividuals,
  openTaxFormDetailsPage,
  openTaxFormFlowAndConfirmPersonalDetails,
} from '../../../helpers/contracts-core/ic-tax-form-assertions-and-shared-functions';
import {
  fill1099DeliveryPreferencesForW9Individuals,
  fillAddressForW9Forms,
  fillPersonalInformationForW9Individuals,
  fillTaxDetailsForW9Individuals,
  signW9TaxForm,
} from '../../../helpers/contracts-core/ic-w9-tax-form-creation';
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

test.describe('Create W9 Tax forms for Individuals', () => {
  test.beforeEach('Create contract, user and login via API', async ({ request }) => {
    test.setTimeout(120 * 1000);
    contractor = await createIndividualContractor({ country: country.US.value });
    client = await createClient({ country: country.US.value });

    const contractData = { client, contractor, contract: { rate: 100, currency: 'USD' }, creator: 'client' };
    contract = await createFixedContract(request, contractData);
    taxformData.firstName = contractor.firstName;
    taxformData.lastName = contractor.lastName;

    contractorContractLink = `contract/${contract.id}`;
  });

  test(
    'US Contractor can create W9 Tax form for Individuals @contract-core-qa-front',
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

      // Step 2: Personal information
      await fillPersonalInformationForW9Individuals(page, taxformData);

      // Step 3: Address
      await fillAddressForW9Forms(page, taxformData);

      // Step 4: Tax details
      await fillTaxDetailsForW9Individuals(page, taxformData);

      // Step 5: 1099 Delivery preferences
      await fill1099DeliveryPreferencesForW9Individuals(page);

      // Step 6: Review & Sign
      await signW9TaxForm(page);

      // Sign as contractor
      await reviewAndSign(page);
      await closeOnboardingWidget(page);

      // Go to Tax form details page to assert the result
      await openTaxFormDetailsPage(page);
      await assertW9TaxDetailsPageIndividuals(page, taxformData, icTaxFormSelectors);
    }
  );
});
