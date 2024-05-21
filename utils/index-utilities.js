/**
 * This function was thought to use to select random state for onboarding employee.
 * Generates a random index between 0 and 49 that has not been used before.
 * The function maintains a record of the indices that have already been used to ensure that there are no repetitions.
 * If all possible indices have already been used, the function will throw an error.
 *
 * @returns {number} A random number between 0 and 49 that has not been used previously.
 * @throws {Error} Throws an error if all 50 possible indices have already been used.
 */
export default function getRandomIndexUsState() {
  const usedIndices = [];

  if (usedIndices.length >= 50) {
    throw new Error('No more unique indices available.');
  }

  let randomIndex;

  do {
    randomIndex = Math.floor(Math.random() * 50);
  } while (usedIndices.includes(randomIndex));

  usedIndices.push(randomIndex);

  return randomIndex;
}
