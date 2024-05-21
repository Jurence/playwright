import { faker } from '@faker-js/faker';

const taxformData = {
  addressLineOne: faker.location.streetAddress(false),
  businessName: faker.company.buzzNoun(),
  beneficialOwnerOrgName: faker.company.buzzNoun(),
  city: faker.location.city(),
  zipCodeAlaska: '99950',
  inputDateOfbirth: '03/01/2006',
  randomZipCode: faker.number.int({ min: 1, max: 9999999999 }),
  tin: faker.number.int({ min: 100000000, max: 999999999 }),
  individualTaxPayer: 'Individual',
  entityTaxPayer: 'Company',
  entityTypeComplexTrust: 'Complex-trust',
  countryUs: 'United States',
  organizationCountryAlbania: 'AL',
  countryAlbania: 'Albania',
  expectedDateOfBirth: 'Mar 1st, 2006',
  factaStatusActiveNffe: 'Active NFFE',
};

export default taxformData;
