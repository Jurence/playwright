import { expect, test } from '@playwright/test';
import { paygContractData } from '../../../data/contracts-core/contract-creation';
import country from '../../../data/countries.json';
import { openContractDetailsByContractor } from '../../../helpers/contracts-core/ic-contract-creation-flow-ui/ic-contracts-core-contract-creation-ui';
import {
  getInvitationLink,
  getInvitedUserEmail,
  inviteContractor,
  reviewAndSign,
} from '../../../helpers/contracts-core/ic-review-and-sign-ui';
import { loginIntoSpecificPage } from '../../../helpers/platform/login-ui';
import { closeOnboardingWidget } from '../../../helpers/shared-functions/general-functions';
import icContractInfo from '../../../selectors/ic-contracts-core/contact-info-contractor';
import { createClientWithNonUSEntity } from '../../../setup/commands/create-client';
import { createIndividualContractor } from '../../../setup/commands/create-contractor';
import createPAYGContract from '../../../setup/commands/ic-contracts-core/ic-payg-contract';
import { password } from '../../../setup/constants';

let client;
let contractor;
let contract;
const { contractDetailsTab } = icContractInfo;
const { personalDetails } = paygContractData;

test.describe('Client and Contractor - PAYG contract signing', () => {
  test.beforeEach('Create contract, user and login via API', async ({ page, request }) => {
    contractor = await createIndividualContractor({ country: country.ES.value });
    client = await createClientWithNonUSEntity({ country: country.ES.value });

    const contractData = {
      client,
      contractor,
      contract: { rate: 150 },
      creator: 'client',
    };
    contract = await createPAYGContract(request, contractData);

    const createdContractLink = `/people/${contract.contractorHrisProfile.id}/contracts/${contract.id}`;
    await loginIntoSpecificPage(page, request, client.email, password, createdContractLink);
  });

  test(
    'Client and Contractor should sign PAYG contract successfully @contract-core-qa-front',
    {
      tag: ['@slowRegression'],
    },
    async ({ page, request }) => {
      // Set the timeout for this test
      test.setTimeout(120 * 1000);

      // Signing contract as client and invite contractor
      await reviewAndSign(page);
      await inviteContractor(page);

      // TODO: We will improve this by creating a new function to skip the onboarding widget
      await closeOnboardingWidget(page);

      const invitedUser = await getInvitedUserEmail(page);
      await expect(invitedUser).toContain(contractor.email.toLowerCase());

      // Get invitation link
      const invitationLink = await getInvitationLink(page);

      // Login as contractor
      await loginIntoSpecificPage(page, request, contractor.email, password, invitationLink);

      // Sign as contractor
      await reviewAndSign(page);

      // TODO: We will improve this by creating a new function to skip the onboarding widget
      await closeOnboardingWidget(page);

      // Open contract details on contractor view
      await openContractDetailsByContractor(page);

      // Assert name and type of contract
      await expect(await page.locator(icContractInfo.contractName)).toHaveText(contract.name);
      await expect(await page.locator(icContractInfo.contractType)).toHaveText(personalDetails.shortContractType);

      // Assert rate and scope of work
      await expect(page.getByTestId(contractDetailsTab.rateTestId)).toContainText(
        `$${contract.workStatements[0].rate.toString()}.00`
      );
      await expect(await page.locator(contractDetailsTab.scopeOfWork)).toHaveText(contract.workStatements[0].scope);
    }
  );
});
