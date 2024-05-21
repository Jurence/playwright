/**
 * Blocks popups on the given page by adding initialization scripts to the page.
 *
 * @param {import('@playwright/test').Page} page - The page object on which to block popups.
 * @returns {Promise<void>} - A promise that resolves once the popups are blocked.
 */
export async function blockPopups(page) {
  await page.addInitScript(() => {
    const featuresArray = [
      'peopleList',
      'bank-details-for-eor',
      'compliance-required-documents',
      'contract-actions',
      'contract-list-for-contractor',
      'contract-page-details',
      'contract-page-review-sign',
      'deel-iq-announcement',
      'edit-columns',
      'global-search',
      'mass-upload-csv-box',
      'massOnboarding',
      'milestone-contract-edit',
      'sensitive-data',
      'services-announcement',
      'sidebar-new-personal-settings',
      'sensitive-data',
      'teams-dropdown-menu',
      'tracker-box',
      'withdrawal-methods-for-contractor',
      'sensitive-data',
      'personView',
      'deel-iq-announcement',
      'teams-dropdown-menu',
      'highlight_time-attendance-left-side-menu',
      'navigation-switch',
      'effectiveDateInTheFuture',
    ];
    localStorage.setItem('highlight_feature_shown', JSON.stringify(featuresArray));
    localStorage.setItem('LS_ESCALATION_BANNER_VISIBILITY', 'false');
    localStorage.setItem('announcement_approvals', 'false');
    localStorage.setItem('announcement_create_contract', 'false');
    localStorage.setItem('announcement_icp_data_updates', 'false');
    localStorage.setItem('announcement_icp_reports', 'false');
    localStorage.setItem('announcement_icp_time_off', 'false');
    localStorage.setItem('announcement_off_cycle_terminations', 'false');
    localStorage.setItem('announcement_payments_toolkit', 'false');
    localStorage.setItem('announcement_perks', 'false');
    localStorage.setItem('announcement_referrals', 'false');
    localStorage.setItem('announcement_reports', 'false');
    localStorage.setItem('announcement_tracker', 'false');
    localStorage.setItem('whats_new_seen_gp_dashboard_new_features', 'false');
    localStorage.setItem('hideWeWorkIntroPopup', 'true');
    localStorage.setItem('how-payments-work-popup-shown', 'true'); // contractor's popup
    localStorage.setItem('invoice_immutability_popup_shown', '["coming-soon", "go-live"]');
    localStorage.setItem('invoices_tutorial_shown', 'true');
    localStorage.setItem('org-chart-instructions-shown', 'true');
    localStorage.setItem('transaction-table-walkthrough', 'true');
    localStorage.setItem('QuoteScopeTestPassed', 'true');
    localStorage.setItem('withdrawalMethodsTourStep', 'method-addition-modal-walkthrough');
    localStorage.setItem('new_app_store_enabled', 'true');
    localStorage.setItem('dismiss_integration_survey_modal', 'true');
    localStorage.setItem('highlight_add_hours_main_container', 'false');
    localStorage.setItem('highlight_log_hours_box_container', 'false');
    localStorage.setItem('highlight_time-attendance-home-quick-access', 'false');
    localStorage.setItem('disable-notification-upsell-modal', '{"contractUpdated":true}');
    localStorage.setItem('whats_new_seen_gp_dashboard_new_features', 'true');
    localStorage.setItem('homePageCartaOfferModal', 'false');
    localStorage.setItem('royalty_reward_banner_new_pill_hidden', 'true');
    localStorage.setItem('CARD_TOUR_KEY', 'done');
    localStorage.setItem('whatsNewAutoWithdrawalPopupAlreadyView', 'true');
    localStorage.setItem('compliance-instructions-shown', 'true');
  });
}

/**
 * Mocks the EOR contracts count by intercepting the network request and fulfilling it with a predefined JSON response.
 * This is required to get rid of the EOR modal.
 *
 * @param {import('@playwright/test').Page} page - The Playwright page object.
 * @returns {Promise<void>} - A promise that resolves once the network request is intercepted and fulfilled.
 */
export async function mockEORContractsCount(page) {
  await page.route('**/eor/created-contracts-count', async (route) => {
    const json = { count: 21 };
    await route.fulfill({ json });
  });
}

/**
 * Removes the CSAT popup from the page.
 *
 * @param {import('@playwright/test').Page} page - The Playwright page object.
 * @returns {Promise<void>} - A promise that resolves when the CSAT popup is removed.
 */
export async function removeCSATPopup(page) {
  await page.route('**/review/**', (route) => {
    return route.request().method() === 'GET' ? route.abort() : route.continue();
  });
}
