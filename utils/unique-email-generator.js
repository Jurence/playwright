import { faker } from '@faker-js/faker';

/**
 * Generates a unique email address based on the provided parameters.
 *
 * @param {string} firstName - The first name of the user.
 * @param {string} lastName - The last name of the user.
 * @param {string} emailType - The type of email address. Can be 'work' or 'personal'.
 * @param {string} [deelUsername=''] - The Deel username (optional).
 * @returns {string} The generated unique email address.
 */
export default function generateUniqueEmail(firstName = 'test', lastName = 'user', emailType = 'work', deelUsername = '') {
  const uniqueId = emailType + Date.now();
  let email;
  const firstNameEmail = `${firstName.toLowerCase()}`.replace(/'/g, '');
  const lastNameEmail = `${lastName.toLowerCase()}+${faker.string.nanoid(10)}`.replace(/'/g, '');

  if (deelUsername) {
    email = `${deelUsername}+${(firstName + lastName).replace(/(\s|\.)+/, '') + uniqueId}@giger.training`.replace(/'/g, ''); // Removes all apostrophes;
  }

  if (emailType === 'personal') {
    email = faker.internet.email({ firstName: firstNameEmail, lastName: lastNameEmail });
  }

  if (emailType === 'work') {
    email = faker.internet.email({ firstName: firstNameEmail, lastName: lastNameEmail, provider: 'automail.com' });
  }

  return email;
}
