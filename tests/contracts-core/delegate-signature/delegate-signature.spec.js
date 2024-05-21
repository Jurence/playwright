import { expect, test } from '@playwright/test';
import country from '../../../data/countries.json';
import { inviteMemberToSign, reviewAndSign } from '../../../helpers/contracts-core/ic-review-and-sign-ui';
import { loginIntoSpecificPage } from '../../../helpers/platform/login-ui';
import icReviewAndSignSelectors from '../../../selectors/ic-contracts-core/review-and-sign';
import { createClientWithNonUSEntity } from '../../../setup/commands/create-client';
import { createIndividualContractor } from '../../../setup/commands/create-contractor';
import { createGroup, inviteMember } from '../../../setup/commands/groups';
import createFixedContract from '../../../setup/commands/ic-contracts-core/ic-fixed-contract';
import createMilestoneContract from '../../../setup/commands/ic-contracts-core/ic-milestone-contract';
import createPAYGContract from '../../../setup/commands/ic-contracts-core/ic-payg-contract';
import { password } from '../../../setup/constants';

let firstClient;
let secondClient;
let contractor;
let contract;
let teamWithMembers;
const peopleMangerAndPayerAdjuster = 'PEOPLE_MANAGER_AND_PAYER_ADJUSTER';

test.describe('Client - Delegate signature to another client', () => {
  test.beforeEach('Create users, new group and invite new to the group', async ({ request }) => {
    // Set the timeout for this test
    test.setTimeout(120 * 1000);

    // Create users
    contractor = await createIndividualContractor({ country: country.ES.value });
    firstClient = await createClientWithNonUSEntity({ country: country.ES.value });
    secondClient = await createClientWithNonUSEntity({ country: country.ES.value });

    // Create new group and invite new member
    teamWithMembers = await createGroup(request, firstClient);
    await inviteMember(request, firstClient, secondClient, teamWithMembers.teamPublicId, peopleMangerAndPayerAdjuster);
  });

  test(
    'Client should delegate signature for Fixed contract @contract-core-qa-front',
    {
      tag: ['@slowRegression'],
    },
    async ({ page, request }) => {
      // Create contract
      const contractData = {
        client: firstClient,
        contractor,
        teamId: teamWithMembers.id,
        contract: { rate: 222, currency: 'USD' },
        creator: 'client',
      };
      contract = await createFixedContract(request, contractData);

      // Open created contract
      const createdContractLink = `/people/${contract.contractorHrisProfile.id}/contracts/${contract.id}`;
      await loginIntoSpecificPage(page, request, firstClient.email, password, createdContractLink);

      // Invite new member to sign the contract
      await inviteMemberToSign(page, secondClient.name);

      // Signing contract as invited client
      await loginIntoSpecificPage(page, request, secondClient.email, password, createdContractLink);
      await reviewAndSign(page);

      // Expect that invited client signed the contract
      await expect(page.getByRole('button', icReviewAndSignSelectors.inviteContactorButton)).toBeEnabled();
    }
  );

  test(
    'Client should delegate signature for PAYG contract @contract-core-qa-front',
    {
      tag: ['@slowRegression'],
    },
    async ({ page, request }) => {
      // Create contract
      const contractData = {
        client: firstClient,
        contractor,
        teamId: teamWithMembers.id,
        contract: { rate: 222, currency: 'USD' },
        creator: 'client',
      };
      contract = await createPAYGContract(request, contractData);

      // Open created contract
      const createdContractLink = `/people/${contract.contractorHrisProfile.id}/contracts/${contract.id}`;
      await loginIntoSpecificPage(page, request, firstClient.email, password, createdContractLink);

      // Invite new member to sign the contract
      await inviteMemberToSign(page, secondClient.name);

      // Signing contract as invited client
      await loginIntoSpecificPage(page, request, secondClient.email, password, createdContractLink);
      await reviewAndSign(page);

      // Expect that invited client signed the contract
      await expect(page.getByRole('button', icReviewAndSignSelectors.inviteContactorButton)).toBeEnabled();
    }
  );

  test(
    'Client should delegate signature for Milestone contract @contract-core-qa-front',
    {
      tag: ['@slowRegression'],
    },
    async ({ page, request }) => {
      // Create contract
      const contractData = {
        client: firstClient,
        contractor,
        teamId: teamWithMembers.id,
        contract: {
          milestones: [
            {
              title: '1st Milestone',
              description: '1st Milestone Description',
              amount: 100,
            },
            {
              title: '2nd Milestone',
              description: '2nd Milestone Description',
              amount: 200,
            },
          ],
        },
        creator: 'client',
      };
      contract = await createMilestoneContract(request, contractData);

      // Open created contract
      const createdContractLink = `/people/${contract.contractorHrisProfile.id}/contracts/${contract.id}`;
      await loginIntoSpecificPage(page, request, firstClient.email, password, createdContractLink);

      // Invite new member to sign the contract
      await inviteMemberToSign(page, secondClient.name);

      // Signing contract as invited client
      await loginIntoSpecificPage(page, request, secondClient.email, password, createdContractLink);
      await reviewAndSign(page);

      // Expect that invited client signed the contract
      await expect(page.getByRole('button', icReviewAndSignSelectors.inviteContactorButton)).toBeEnabled();
    }
  );
});
