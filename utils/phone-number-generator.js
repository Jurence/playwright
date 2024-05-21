import { faker } from '@faker-js/faker';
import { getExampleNumber } from 'libphonenumber-js';
import examples from 'libphonenumber-js/examples.mobile.json';
import countries from '../data/countries.json';

/**
 * Retrieves country details by country code or returns a random country details if no code is provided.
 *
 * @param {string} [countryCode='ANY'] - The country code to retrieve details for. Defaults to 'ANY'.
 * @returns {Object} - An object containing details of the specified country or a random country.
 */
function getCountry(countryCode = 'ANY') {
  // Declare values and randomCountry outside of the switch statement
  const values = Object.values(countries); // Changed variable name to match import
  let randomCountry;

  switch (countryCode) {
    case 'US':
      return countries.US; // Return country details for the United States
    case 'CA':
      return countries.CA; // Return country details for Canada
    case 'GB':
      return countries.GB; // Return country details for the United Kingdom
    case 'DE':
      return countries.DE; // Return country details for Germany
    case 'ANY':
      randomCountry = values[parseInt(Math.random() * values.length, 10)];

      return randomCountry; // Return a random country from the list
    default:
      return countries[`${countryCode}`]; // Return country details based on the provided country code
  }
}

/**
 * Generates a random phone number based on provided data.
 * @param {Object} data - Data object containing information about the country.
 *                        It should contain at least a 'country' property specifying the country code.
 * @returns {Object} An object containing the generated phone number, phone code, and formatted phone numbers.
 */
export default function generatePhoneNumber(data) {
  // Retrieve country details based on the provided country code using getCountry function
  const countryDetails = getCountry(data.country);

  // Get an example phone number for the specified country
  const phoneNumber = getExampleNumber(countryDetails.value, examples);

  let phone;
  let randomDigits;

  // Set to store used phone numbers
  const usedPhoneNumbers = new Set();

  // Generate a unique random 7-digit number
  do {
    randomDigits = faker.number.int({ min: 1000000, max: 9999999 }).toString();
    phone = `${countryDetails.dialCode[0]}${phoneNumber.nationalNumber.slice(0, -7)}${randomDigits}`;
  } while (usedPhoneNumbers.has(phone));

  // Add the generated phone number to the set of used phone numbers
  usedPhoneNumbers.add(phone);

  // Returns an object containing the generated phone number, phone code, and formatted phone numbers
  return {
    phone,
    phoneCode: countryDetails.dialCode[0],
    phoneNumbers: `${countryDetails.dialCode[0]}${phoneNumber.nationalNumber}`,
  };
}
