import { faker } from '@faker-js/faker';
import { expect, test } from '@playwright/test';
import country from '../../../data/countries.json';
import { exitFromAmendment, reviewAndSignAmendment, signAmendment } from '../../../helpers/contracts-core/ic-amendment';
import {
  fillCurrency,
  fillRate,
  fillScopeOfWork,
  fillSpecialClause,
  selectInvoiceCycle,
} from '../../../helpers/contracts-core/ic-contract-creation-flow-ui/ic-base-methods';
import { loginIntoSpecificPage } from '../../../helpers/platform/login-ui';
import { continueToNextStep } from '../../../helpers/shared-functions/form-functions';
import appHomePageSelectors from '../../../selectors/app-home/app-home-page';
import icContractAmendmentSelectors from '../../../selectors/ic-contracts-core/amendment-contract';
import icContractInfo from '../../../selectors/ic-contracts-core/contact-info-contractor';
import integrationsSelectors from '../../../selectors/integrations/shared-integration-selectors';
import { createClientWithNonUSEntity } from '../../../setup/commands/create-client';
import { createIndividualContractor } from '../../../setup/commands/create-contractor';
import createPAYGContract from '../../../setup/commands/ic-contracts-core/ic-payg-contract';
import {
  sendInvitationToContractorFromClient,
  signUpICContractWithoutTaxForms,
} from '../../../setup/commands/ic-contracts-core/ic-sign-contract';
import uploadFile from '../../../setup/commands/upload-file';
import { password } from '../../../setup/constants';
import URLS from '../../../setup/urls';

test.describe('Amendment PAYG contract', () => {
  const { contractDetailsTab } = icContractInfo;
  const { myTaskSection } = appHomePageSelectors;
  let client;
  let contractor;
  let contract;
  const newContractData = {
    cycle: 'Monthly',
    currency: 'EUR',
    rate: 200,
    sow: `TEST: ${faker.lorem.sentences(3)}`,
    specialClause: 'Test Amendment: Special Clause',
  };
  const file = {
    name: 'dummy-doc.pdf',
    path: 'data/dummy-doc.pdf',
    type: 'application/pdf',
  };
  const draftStatusChip = 'Draft';

  test.beforeEach('Create Contractor and Client, sign contracts and login as a Client', async () => {
    contractor = await createIndividualContractor({ country: country.ES.value });
    client = await createClientWithNonUSEntity({ country: country.ES.value });
  });

  test(
    'Client should amend PAYG contract successfully @contract-core-qa-front',
    {
      tag: ['@slowRegression'],
    },
    async ({ page, request }) => {
      // Set the timeout for this test
      test.setTimeout(120 * 1000);

      // Create the contract and sign from both sides
      const contractData = {
        client,
        contractor,
        contract: { rate: 100 },
        creator: 'client',
      };
      contract = await createPAYGContract(request, contractData);

      await signUpICContractWithoutTaxForms(request, contract.id, client.token, client.legalEntityId);
      await sendInvitationToContractorFromClient(request, contract.id, contractor.email, { type: null }, client.token);
      await signUpICContractWithoutTaxForms(request, contract.id, contractor.token, contractor.legalEntityId);

      const createdContractLink = `/people/${contract.contractorHrisProfile.id}/contracts/${contract.id}`;
      await loginIntoSpecificPage(page, request, client.email, password, createdContractLink);

      // Edit contract as Client
      await page.getByTestId(icContractAmendmentSelectors.editContractBtnTestId).click();

      // Step 1:Edit contract details
      await fillScopeOfWork(page, newContractData.sow);
      await fillCurrency(page, newContractData.currency);
      await fillRate(page, newContractData.rate);
      await selectInvoiceCycle(page, newContractData.cycle);
      await fillSpecialClause(page, newContractData.specialClause);
      await continueToNextStep(page);

      // Step 2:Confirm payments (skip this step cause will not update anything on this step)
      await continueToNextStep(page);

      // Sign amendment as client
      await signAmendment(page);

      // Login as contractor
      await loginIntoSpecificPage(page, request, contractor.email, password, `contract/${contract.id}/details`);

      // Sign amendment as contractor
      await reviewAndSignAmendment(page);
      await signAmendment(page);

      // Expect contract changes
      await expect(page.getByTestId(contractDetailsTab.cycleTypeTestId)).toContainText(`${newContractData.cycle} rate`);
      await expect(page.getByTestId(contractDetailsTab.rateTestId)).toContainText(`€${newContractData.rate.toString()}.00`);
      await expect(page.locator(contractDetailsTab.specialClause)).toHaveText(newContractData.specialClause);
      await expect(page.locator(contractDetailsTab.scopeOfWork)).toHaveText(newContractData.sow);
    }
  );

  test(
    'Client should delete attachment successfully during amendment PAYG IC @contract-core-qa-front',
    {
      tag: ['@slowRegression'],
    },
    async ({ page, request }) => {
      // Set the timeout for this test
      test.setTimeout(180 * 1000);

      // Upload file
      const fileData = await uploadFile(request, client.token, file);

      // Create the contract and sign from both sides
      const contractData = {
        client,
        contractor,
        contract: { rate: 100 },
        ...fileData,
        creator: 'client',
      };
      contract = await createPAYGContract(request, contractData);

      await signUpICContractWithoutTaxForms(request, contract.id, client.token, client.legalEntityId);
      await sendInvitationToContractorFromClient(request, contract.id, contractor.email, { type: null }, client.token);
      await signUpICContractWithoutTaxForms(request, contract.id, contractor.token, contractor.legalEntityId);

      const createdContractLink = `/people/${contract.contractorHrisProfile.id}/contracts/${contract.id}`;
      await loginIntoSpecificPage(page, request, client.email, password, createdContractLink);

      // Edit contract as Client
      await page.getByTestId(icContractAmendmentSelectors.editContractBtnTestId).click();

      // Step 1:Edit contract details
      await page.getByTestId(icContractAmendmentSelectors.deleteAttachmentTestId).click();
      await continueToNextStep(page);

      // Sign amendment as client
      await signAmendment(page);

      // Login as contractor
      await loginIntoSpecificPage(page, request, contractor.email, password, `contract/${contract.id}/details`);

      // Sign amendment as contractor
      await reviewAndSignAmendment(page);
      await signAmendment(page);

      // Expect contract changes
      await expect(page.getByText(`${contractDetailsTab.attachmentName}${file.name}`)).not.toBeVisible();
    }
  );

  test(
    'Client should create draft amendment successfully for PAYG @contract-core-qa-front',
    {
      tag: ['@slowRegression'],
    },
    async ({ page, request }) => {
      // Set the timeout for this test
      test.setTimeout(120 * 1000);

      // Create the contract and sign from both sides
      const contractData = {
        client,
        contractor,
        contract: { rate: 100, currency: 'USD' },
        creator: 'client',
      };
      contract = await createPAYGContract(request, contractData);

      await signUpICContractWithoutTaxForms(request, contract.id, client.token, client.legalEntityId);
      await sendInvitationToContractorFromClient(request, contract.id, contractor.email, { type: null }, client.token);
      await signUpICContractWithoutTaxForms(request, contract.id, contractor.token, contractor.legalEntityId);

      const createdContractLink = `/people/${contract.contractorHrisProfile.id}/contracts/${contract.id}`;
      await loginIntoSpecificPage(page, request, client.email, password, createdContractLink);

      // Edit contract as Client
      await page.getByTestId(icContractAmendmentSelectors.editContractBtnTestId).click();

      // Step 1:Edit contract details
      await fillScopeOfWork(page, newContractData.sow);
      await fillSpecialClause(page, newContractData.specialClause);
      await continueToNextStep(page);

      // Click exit
      await exitFromAmendment(page);

      // Check that draft created
      await expect(page.getByTestId(icContractAmendmentSelectors.statusChipTestId)).toHaveText(draftStatusChip);
      await expect(page.getByTestId(icContractAmendmentSelectors.reviewDraftButtonTestId)).toBeVisible();
      await expect(page.getByTestId(icContractAmendmentSelectors.deleteDraftButtonTestId)).toBeVisible();
    }
  );

  test('Client should delete draft amendment successfully for PAYG @contract-core-qa-front', async ({ page, request }) => {
    // Create the contract and sign from both sides
    const contractData = {
      client,
      contractor,
      contract: { rate: 100, currency: 'USD' },
      creator: 'client',
    };
    contract = await createPAYGContract(request, contractData);

    await signUpICContractWithoutTaxForms(request, contract.id, client.token, client.legalEntityId);
    await sendInvitationToContractorFromClient(request, contract.id, contractor.email, { type: null }, client.token);
    await signUpICContractWithoutTaxForms(request, contract.id, contractor.token, contractor.legalEntityId);

    const createdContractLink = `/people/${contract.contractorHrisProfile.id}/contracts/${contract.id}`;
    await loginIntoSpecificPage(page, request, client.email, password, createdContractLink);

    // Edit contract as Client
    await page.getByTestId(icContractAmendmentSelectors.editContractBtnTestId).click();

    // Step 1:Edit contract details
    await fillScopeOfWork(page, newContractData.sow);
    await fillSpecialClause(page, newContractData.specialClause);
    await continueToNextStep(page);

    // Click exit
    await exitFromAmendment(page);

    // Delete draft
    await page.getByTestId(icContractAmendmentSelectors.deleteDraftButtonTestId).click();
    await page.getByRole('button', integrationsSelectors.deleteButton).click();

    // Check that draft created
    await expect(page.getByTestId(icContractAmendmentSelectors.statusChipTestId)).not.toHaveText(draftStatusChip);
    await expect(page.getByTestId(icContractAmendmentSelectors.reviewDraftButtonTestId)).toBeHidden();
    await expect(page.getByTestId(icContractAmendmentSelectors.deleteDraftButtonTestId)).toBeHidden();
  });

  test(
    'Contractor should sign PAYG amendment from Home page task @contract-core-qa-front',
    {
      tag: ['@slowRegression'],
    },
    async ({ page, request }) => {
      // Set the timeout for this test
      test.setTimeout(120 * 1000);

      // Create the contract and sign from both sides
      const contractData = {
        client,
        contractor,
        contract: { rate: 100 },
        creator: 'client',
      };
      contract = await createPAYGContract(request, contractData);

      await signUpICContractWithoutTaxForms(request, contract.id, client.token, client.legalEntityId);
      await sendInvitationToContractorFromClient(request, contract.id, contractor.email, { type: null }, client.token);
      await signUpICContractWithoutTaxForms(request, contract.id, contractor.token, contractor.legalEntityId);

      const createdContractLink = `/people/${contract.contractorHrisProfile.id}/contracts/${contract.id}`;
      await loginIntoSpecificPage(page, request, client.email, password, createdContractLink);

      // Edit contract as Client
      await page.getByTestId(icContractAmendmentSelectors.editContractBtnTestId).click();

      // Step 1:Edit contract details
      await fillScopeOfWork(page, newContractData.sow);
      await fillCurrency(page, newContractData.currency);
      await fillRate(page, newContractData.rate);
      await selectInvoiceCycle(page, newContractData.cycle);
      await fillSpecialClause(page, newContractData.specialClause);
      await continueToNextStep(page);

      // Step 2:Confirm payments (skip this step cause will not update anything on this step)
      await continueToNextStep(page);

      // Sign amendment as client
      await signAmendment(page);

      // Login as contractor
      await loginIntoSpecificPage(page, request, contractor.email, password, URLS.HOME);

      // Open amendment from home page
      await page.getByRole('button', myTaskSection.viewTasksBtn).click();
      await page.getByText(myTaskSection.reviewAndSignContractText).click();
      await page.getByRole('link', myTaskSection.viewLink).click();

      // Sign amendment as contractor
      await signAmendment(page);

      // Expect contract changes
      await expect(page.getByTestId(contractDetailsTab.cycleTypeTestId)).toContainText(`${newContractData.cycle} rate`);
      await expect(page.getByTestId(contractDetailsTab.rateTestId)).toContainText(`€${newContractData.rate.toString()}.00`);
      await expect(page.locator(contractDetailsTab.specialClause)).toHaveText(newContractData.specialClause);
      await expect(page.locator(contractDetailsTab.scopeOfWork)).toHaveText(newContractData.sow);
    }
  );
});
