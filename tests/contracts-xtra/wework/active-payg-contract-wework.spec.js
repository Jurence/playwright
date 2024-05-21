import { faker } from '@faker-js/faker';
import { expect, test } from '@playwright/test';
import country from '../../../data/countries.json';
import {
  addWeworkAccessOnCoworkingPage,
  completeWeworkAccess,
  openCoworkingPage,
  removeWeworkAccess,
} from '../../../helpers/contracts-xtra/wework-ui';
import { loginIntoSpecificPage } from '../../../helpers/platform/login-ui';
import weworkSelector from '../../../selectors/wework/wework-page';
import { createClientWithNonUSEntity } from '../../../setup/commands/create-client';
import { createIndividualContractor } from '../../../setup/commands/create-contractor';
import createPAYGContract from '../../../setup/commands/ic-contracts-core/ic-payg-contract';
import {
  sendInvitationToContractorFromClient,
  signUpICContractWithoutTaxForms,
} from '../../../setup/commands/ic-contracts-core/ic-sign-contract';
import { password } from '../../../setup/constants';

test.describe('Client - Wework for active PAYG contract', () => {
  let client;
  let contractor;
  let contract;
  let contractData;

  test.beforeEach('Create Contractor and Client, sign contracts and login as a Client', async ({ page, request }) => {
    test.setTimeout(90 * 1000);
    contractor = await createIndividualContractor({ country: country.ES.value });
    client = await createClientWithNonUSEntity({ country: country.ES.value });

    contractData = {
      client,
      contractor,
      contract: {
        rate: faker.number.int({ min: 1, max: 100 }),
        currency: 'USD',
        jobTitleName: 'Software QA Engineer',
        scope: faker.lorem.sentences(4),
        name: 'Xtra team wework access for active contract',
        terminationNoticeDays: faker.number.int({ min: 1, max: 4000 }),
      },
      creator: 'client',
    };

    contract = await createPAYGContract(request, contractData);

    await signUpICContractWithoutTaxForms(request, contract.id, client.token, client.legalEntityId);
    await sendInvitationToContractorFromClient(request, contract.id, contractor.email, { type: null }, client.token);
    await signUpICContractWithoutTaxForms(request, contract.id, contractor.token, contractor.legalEntityId);

    const createdContractLink = `/people/${contract.contractorHrisProfile.id}/contracts/${contract.id}`;
    await loginIntoSpecificPage(page, request, client.email, password, createdContractLink);
  });

  test('Client should add wework access to active payg contract @xtra-qa-front', async ({ page }) => {
    await openCoworkingPage(page);
    await addWeworkAccessOnCoworkingPage(page);
    await completeWeworkAccess(page);

    await expect(page.getByLabel(weworkSelector.removeWeworkAccessLabel)).toBeVisible();
    await expect(page.getByText(weworkSelector.requestPendingText)).toBeVisible();
    await expect(page.getByText(weworkSelector.weworkMonthlyFeeText)).toBeVisible();
    await expect(page.getByRole('button', weworkSelector.addWeworkAccessButton)).toBeHidden();
  });

  test('Client should remove wework access from an active payg contract @xtra-qa-front', async ({ page }) => {
    await openCoworkingPage(page);
    await addWeworkAccessOnCoworkingPage(page);
    await completeWeworkAccess(page);
    await removeWeworkAccess(page);

    await expect(page.getByRole('button', weworkSelector.addWeworkAccessButton)).toBeVisible();
    await expect(page.getByLabel(weworkSelector.removeWeworkAccessLabel)).toBeHidden();
    await expect(page.getByText(weworkSelector.requestPendingText)).toBeHidden();
  });
});
