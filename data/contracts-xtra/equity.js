import { faker } from '@faker-js/faker';
import moment from 'moment/moment';

const equityData = {
  grantInformationDetails: {
    equityGrantName: faker.lorem.slug(2),
    equityTypeText: 'ISO',
    equityGrantTypeText: 'Merit',
    equityGrantStatusText: 'Granted',
    equityGrantValue: faker.number.int(50000),
    equityAdditionalGrantRequirements: faker.lorem.slug(10),
    equityGrantCurrencyText: 'USD',
    equityGrantQuantity: faker.number.int(30000),
    equityGrantExercisePrice: faker.number.int(10000),
    equityGrantExerciseCurrencyText: 'UGX',
    equityGrantDate: moment().format('MMDDYYYY'),
    equityGrantExpirationDate: moment().add(1, 'y').format('MMDDYYYY'),
    agreementMSADate: moment().format('MMDDYYYY'),
  },
  additionalInformationDetails: {
    vestingEffectiveDate: moment().format('MMDDYYYY'),
    vestingDuration: faker.number.int({ min: 100, max: 120 }),
    vestingIntervals: faker.number.int({ min: 1, max: 100 }),
    cliffPeriod: faker.number.int({ min: 1, max: 100 }),
  },
  finalInformationDetails: {
    equityFinalAdditionalInformation: faker.lorem.slug(20),
  },
  documentDetails: {
    documentType: 'Equity service agreement',
    equityAgreementEffectiveDate: moment().add(1, 'y').format('MMDDYYYY'),
  },
};

export default equityData;
