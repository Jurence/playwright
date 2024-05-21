import URLS from '../../../setup/urls';
import overviewSelectors from '../../../selectors/hris/analytics/overview';
import deiDasboardSelectors from '../../../selectors/hris/analytics/dei-dashboard';
import peopleDashboardSelectors from '../../../selectors/hris/analytics/people-dashboard-page';
import compensationDashboardSelectors from '../../../selectors/hris/analytics/compensation-dashboard-page';
import timeOffDashboardSelectors from '../../../selectors/hris/analytics/timeOff-dashboard-page';

export const overview = {
  widgets: {
    headcount: overviewSelectors.activeHeadcountText,
    growthRate: overviewSelectors.growthRateText,
    starters: overviewSelectors.startersText,
    avgCompensation: overviewSelectors.avgCompensationText,
    avgTimePerEvent: overviewSelectors.avgTimePerEventText,
    unpaidTimeOffTaken: overviewSelectors.unpaidTimeOffTakenText,
    enableGender: overviewSelectors.enableGenderText,
    enableEthnicity: overviewSelectors.enableEthnicityText,
  },
};

export const peopleDashboard = {
  name: 'People',
  unlockBtnPosition: 0,
  button: overviewSelectors.peopleDashboardBtnTestId,
  url: URLS.ANALYTICS_PEOPLE_DASHBOARD,
  buttons: {
    activeHeadcount: peopleDashboardSelectors.activeHeadcountButton,
    growth: peopleDashboardSelectors.growthRateButton,
    starters: peopleDashboardSelectors.startersButton,
  },
  widgets: {
    headcount: peopleDashboardSelectors.headcountText,
    growthRate: peopleDashboardSelectors.growthRateText,
    startersByWorkerType: peopleDashboardSelectors.startersByWorkerTypeText,
    leaversByReason: peopleDashboardSelectors.leaversByReasonText,
    topActiveCountries: peopleDashboardSelectors.topActiveCountriesText,
    startersVsLeavers: peopleDashboardSelectors.startersVsLeaversText,
    attritionRate: peopleDashboardSelectors.attritionRateText,
    terminationReasons: peopleDashboardSelectors.terminationReasonsText,
    turnoverRate: peopleDashboardSelectors.turnoverRateText,
    retentionRate: peopleDashboardSelectors.retentionRateText,
    workerToManagerRatio: peopleDashboardSelectors.workerToManagerRatioText,
    averageTenure: peopleDashboardSelectors.averageTenureText,
  },
};

export const compensationDashboard = {
  name: 'Compensation',
  unlockBtnPosition: 1,
  button: overviewSelectors.compensationDashboardBtnTestId,
  url: URLS.ANALYTICS_COMPENSATION_DASHBOARD,
  widgets: {
    totalCompensation: compensationDashboardSelectors.totalCompensationText,
    totalPayroll: compensationDashboardSelectors.totalPayrollText,
    avgCompensation: compensationDashboardSelectors.avgCompensationText,
    compensationPerCountry: compensationDashboardSelectors.compensationPerCountryText,
    compensationByJobTitle: compensationDashboardSelectors.compensationByJobTitleText,
    agePayGap: compensationDashboardSelectors.agePayGapText,
  },
};

export const timeOffDashboard = {
  name: 'Time Off',
  unlockBtnPosition: 2,
  button: overviewSelectors.timeOffDashboardBtnTestId,
  url: URLS.ANALYTICS_TIME_OFF_DASHBOARD,
  widgets: {
    UnpaidTimeOffTaken: timeOffDashboardSelectors.unpaidTimeOffTakenText,
    AvgTimePerEvent: timeOffDashboardSelectors.avgTimePerEventText,
    TimeOffRequestsApprovedVsDeclined: timeOffDashboardSelectors.timeOffRequestsApprovedVsDeclinedText,
  },
};

export const deiDashboard = {
  name: 'DEI',
  unlockBtnPosition: 3,
  button: overviewSelectors.deiDashboardBtnTestId,
  url: URLS.ANALYTICS_DEI_DASHBOARD,
  widgets: {
    avgCompensation: deiDasboardSelectors.avgCompensationText,
    headcountGender: deiDasboardSelectors.headcountGenderText,
    genderOverTime: deiDasboardSelectors.genderOverTimeText,
    attrition: deiDasboardSelectors.attritionText,
  },
};
