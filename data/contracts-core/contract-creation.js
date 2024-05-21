import { faker } from '@faker-js/faker';

export const fixedContractData = {
  personalDetails: {
    shortContractType: 'Fixed',
    contractType: 'Contractor · Fixed rate',
    contractName: faker.lorem.slug(),
    contractorResidence: 'Use the information from contractor',
  },
  roleDetails: {
    sow: faker.lorem.sentences(3),
    seniority: 'Senior (Individual Contributor Level 3)',
  },
  paymentDetails: {
    currency: 'USD',
    paymentRate: faker.number.int(10000),
  },
  compliance: {
    specialClause: faker.lorem.slug(),
  },
};

export const paygContractData = {
  personalDetails: {
    shortContractType: 'Pay As You Go',
    contractType: 'Contractor · Pay As You Go',
    contractName: faker.lorem.slug(),
    contractorResidence: 'Use the information from contractor',
  },
  roleDetails: {
    seniority: 'Senior (Individual Contributor Level 3)',
    sow: faker.lorem.sentences(3),
  },
  paymentDetails: {
    currency: 'USD',
    rate: 'Fixed rate',
    paymentRate: faker.number.int(10000),
    paymentFrequency: 'Hour',
    paymentFrequencyText: 'Per hour',
    invoiceCycle: 'Monthly',
  },
  compliance: {
    specialClause: faker.lorem.slug(),
  },
};

export const milestoneContractData = {
  personalDetails: {
    shortContractType: 'Milestones',
    contractType: 'Contractor · Milestone',
    contractName: faker.lorem.slug(),
    contractorResidence: 'Use the information from contractor',
  },
  roleDetails: {
    sow: faker.lorem.sentences(3),
    seniority: 'Senior (Individual Contributor Level 3)',
  },
  paymentAndMilestoneDetails: {
    currency: 'EUR',
    milestoneName: faker.lorem.slug(),
    milestoneDescription: faker.lorem.sentences(1),
    milestoneAmount: faker.number.int(10000),
  },
  compliance: {
    specialClause: faker.lorem.slug(),
  },
};

export const reviewAndSignInviteClientBtn = 'Invite client';

export const fixedContractPayload = {
  name: `fixed-${Math.floor(Math.random() * 10000) + 1}`,
  type: 'ongoing_time_based',
  jobTitleName: 'Software QA Engineer',
  jobTitleId: 1957,
  seniorityId: 34,
  data: {
    docsAreMandatory: true,
    isMainIncome: false,
  },
  isPaidOutsideOfDeel: false,
  saveAsDefaultSchedule: true,
};
