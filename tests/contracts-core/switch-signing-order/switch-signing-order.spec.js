import { expect, test } from '@playwright/test';
import { fixedContractData } from '../../../data/contracts-core/contract-creation';
import country from '../../../data/countries.json';
import {
  getInvitationLink,
  inviteContractor,
  reviewAndSign,
  switchSigningOrder,
} from '../../../helpers/contracts-core/ic-review-and-sign-ui';
import { loginIntoSpecificPage } from '../../../helpers/platform/login-ui';
import { closeOnboardingWidget } from '../../../helpers/shared-functions/general-functions';
import icContractInfo from '../../../selectors/ic-contracts-core/contact-info-contractor';
import { createClientWithNonUSEntity } from '../../../setup/commands/create-client';
import { createIndividualContractor } from '../../../setup/commands/create-contractor';
import createFixedContract from '../../../setup/commands/ic-contracts-core/ic-fixed-contract';
import { password } from '../../../setup/constants';

test.describe('Client and Contractor - switch signing order', () => {
  let client;
  let contractor;
  let contract;
  let createdContractLink;
  let expectedContractRate;
  let expectedContractScope;
  const { contractDetailsTab } = icContractInfo;
  const { personalDetails } = fixedContractData;
  test.beforeEach('Create contract, user and login via API', async ({ request }) => {
    test.setTimeout(120 * 1000);
    contractor = await createIndividualContractor({ country: country.ES.value });
    client = await createClientWithNonUSEntity({ country: country.ES.value });

    const contractData = { client, contractor, contract: { rate: 100, currency: 'USD' }, creator: 'client' };
    contract = await createFixedContract(request, contractData);
    expectedContractRate = contract.workStatements[0].rate.toString();
    expectedContractScope = contract.workStatements[0].scope;

    createdContractLink = `/people/${contract.contractorHrisProfile.id}/contracts/${contract.id}`;
  });

  test(
    'Client should switch sign order @contract-core-qa-front',
    {
      tag: ['@slowRegression'],
    },
    async ({ page, request }) => {
      // Switching signing order and invite Contractor => Contractor signs first
      await loginIntoSpecificPage(page, request, client.email, password, createdContractLink);
      await switchSigningOrder(page);
      await inviteContractor(page);

      // TODO: We will improve this by creating a new function to skip the onboarding widget
      await closeOnboardingWidget(page);

      // Get invitation link
      const invitationLink = await getInvitationLink(page);

      // Login as contractor
      await loginIntoSpecificPage(page, request, contractor.email, password, invitationLink);

      // Sign as contractor
      await reviewAndSign(page);

      // Login as Client
      await loginIntoSpecificPage(page, request, client.email, password, createdContractLink);

      // Sign as Client
      await reviewAndSign(page);

      // Assert name and type of contract
      await expect(page.locator(contractDetailsTab.contractNameField)).toHaveText(contract.name);
      await expect(page.getByTestId(contractDetailsTab.contractTypeFieldTestId)).toContainText(personalDetails.shortContractType);

      // Assert rate and scope of work
      await expect(page.getByTestId(contractDetailsTab.rateTestId)).toContainText(`$${expectedContractRate}.00`);
      await expect(page.locator(contractDetailsTab.scopeOfWork)).toHaveText(expectedContractScope);
    }
  );
});
