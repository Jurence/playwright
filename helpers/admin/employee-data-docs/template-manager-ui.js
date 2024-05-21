import templateManagerSelectors from '../../../selectors/admin/employee-data-and-docs-menu/template-manager';

const { templates } = templateManagerSelectors;

export default async function reviewAndSubmitTemplateCreation(page) {
  // Review page
  await page.getByRole('button', templates.submitBtn).first().click();

  // Template Created modal
  await page.locator(templates.okBtn).click();
}
