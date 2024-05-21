/**
 * Quick Guide & Best practices:
 * 1. Add new constants to the bottom of the file if necessary.
 * 2. Use camelCase for naming.
 * 3. Always use the same name for constants as the respective folder's name directly under the "/tests" directory.
 * For instance, for the "tests/contract" folder, you should create an export const contract = { ... }
 * 4. Import any constants from this file to the test file where you need them.
 *
 * Usage rules in test files:
 * Please use a destructuring assignment to reach text inside the constants.
 * For instance, if you need to get the "contractText" under the contract constant in the texts.js file, you should use:
 * import { contract } from '../../../data/texts';
 * const { contractText } = contract;
 * await expect(page.getByTestId('page-header-title')).toContainText(contractText);
 */

export const mobility = {
  workEligibility:
    'The hiring country is different from the nationality of this employee. ' +
    'We require a work eligibility document such as a work permit or visa to continue onboarding. ' +
    'If further visa support is required, including a transfer of visa or new permit additional costs can be incurred. ' +
    'For further information about verifying work eligibility and pricing click here',
  rejectionReason: 'Rejection reason -',
  process5of5Completed: '5/5 completed',
  eligibilityModalFirstStep:
    'If your employee already holds a proof of employment eligibility, Deel will open an Immigration Document Review case and request that the employee uploads this document for review.How does it work?When creating a contract for an employee of this type, indicate that they already hold a proof of work eligibility document for this countryOnce the employee has signed up they will be asked to upload this documentDeel will review the document and once approved the employee can be onboardedWatch a video walkthrough here',
  eligibilityModalSecondStep:
    'As part of an Immigration Document Review case Deel may be required to charge additional fees specific to the hiring country which will be presented for approval prior to finalising the case.What types of fees could be charged?Change of employer or transfer of visaNotifications of changes to local authoritiesApplication for a new visa or work permit if requiredWatch a video walkthrough here',
  visaInformationModalTxt: {
    title: 'Visa information',
    subTitle: 'Select different types of visa to see all details',
    alert:
      'Deel will carry out an assessment based upon information provided and recommend one of the following visa types for application.',
  },
  visaApplicationModalTxt: {
    stepOneMainText:
      'Deel will carry out an initial visa eligibility assessment ' +
      ' prior to commencing a visa application to determine whether your employee could be eligible ' +
      'for a visa in the hiring country and also provide an accurate breakdown of costs.',
    stepTwoMainText:
      'As part of the visa application process there are ' +
      'two standard fees charged. In addition, Deel may be required to charge additional fees specific to the hiring country ' +
      'which will be presented for approval prior to continuing an application. Standard fees include;',
  },
};

export const eor = {
  employmentEligibilitySpain: 'A government-issued document that proves your right to work and live in Spain.',
  eligibilityChipNotSubmitted: 'Not submitted',
  chipOrangeColor: 'rgb(247, 132, 0)',
};

export const gp = {
  contractCreationBirthDate: '01/01/1990',
  contractCreationSuccessMessage: 'Contract created',
};

export const embeddedPayroll = {
  orgSettingPageHeaderText: 'Organization Settings',
  taskListText: {
    stepOneHeader: 'Add employees',
    stepOneDescription: 'Add all of your current employees into the system so we are able to run payroll.',
    stepTwoHeader: 'Set payroll schedule',
    stepTwoDescription: 'Set up the payroll schedule to automate payroll.',
    stepThreeHeader: 'Add tax registration info',
    stepThreeDescription:
      'You will have to provide the registration information for the jurisdictions in which employees work and live.',
  },
  addEmployeesText: {
    departmentsAddHeader: 'Departments(optional)Add',
    continueToStep4: 'ContinueNext step:4. Validate',
    placeholderForManuallyAddEmployee: 'Your employee list will be available after your add at least one employee.',
    processingEmployees: 'Processing employees',
    notifyYouWhenDone: 'We will notify you when this process is complete.',
  },
  dataValidated: {
    successMessage: 'No errors were found in your',
    errorMessage: 'Download errors CSV',
    alertMissingValueErrorMessage:
      '9 required values are missing. Reference the template and edit below, or reupload your CSV file.',
    alertUnacceptedValueErrorMessage:
      '1 value is unaccepted in accepted formats. Reference the template and edit below, or reupload your CSV file.',
  },
  setPayrollSchedule: {
    payrollSchedule: 'Payroll schedule was added',
    lastDayOfCycle: 'Last day of cycle',
    afterCycleEnds: 'After cycle ends',
    beforeCycleEnds: 'Before cycle ends',
    daysBeforeDropdownListbox: { name: 'Days before cycle ends' },
    twoDaysBefore: '2 days before cycle ends',
    threeDaysAfter: '3 days after cycle ends',
    sixDaysAfter: '6 days after cycle ends',
    oneDayAfter: '1 day after cycle ends',
    monthlySchedule: 'Monthly',
    mondayToFridayWorkWeek: 'Mon., Tue., Wed., Thu., Fri.',
    customWorkWeek: 'Wed., Thu., Fri., Sat., Sun.',
    hours: 'hrs',
    no: 'No',
    notSpecified: 'Not specified',
  },
  stateRegistrations: {
    caEttRate: 'CA - ETT Rate',
    caUiRate: 'CA - UI Rate',
    caEddNumber: 'CA - EDD Number',
  },
  newHireReport: {
    employersWithEmployeesIn:
      'Employers with employees in multiple states can use this Multistate Employer Registration to register or update their registration for submitting new hire reports. By designating one state where any employee works, the company can transmit all new hire reports to the State Directory of New Hires.',
  },
};

export const contractsCore = {
  reviewAndSignInviteClientBtn: 'Invite client',
  payButtonText: 'pay invoice',
  creditedInvoiceLabel: 'credited',
  reinstateBannerHeader: 'Contract has been canceled',
};

export const globalPayroll = {
  offCycleIntroductoryModal: {
    title: 'How to run an off-cycle',
    subtitle: 'Create off-cycle',
  },
};

export const deelCard = {
  deelCardLandingPageTexts: {
    dashboardLink: 'Dashboard',
    settingsLink: 'Settings',
    alertMessageText:
      "While we verify your ID and address, you can add up to $700 USD to your Deel Card wallet. You'll be able to use it once verification is complete. Learn more",
    allCardsHeading: 'All cards share the same wallet balance.',
    learnMoreLink: 'https://help.letsdeel.com/hc/en-gb/articles/4414103613841-Deel-Card-verification-process',
    confirmedHeadingBodyText:
      "Your Deel Card order is confirmedWe've approved your documents, and your card will ship soon. Once it ships, you'll receive your tracking information.",
  },
};
