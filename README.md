# Playwright-E2E Demo

## Overview
This repository contains a demo of automated tests using Playwright and JavaScript.

## Table Of Contents
- [Prerequisites](#prerequisites)
- [Setup](#setup)
- [env Folder](#env-folder)
- [Running Tests and Reports](#running-tests-and-reports)
  - [Local Execution](#local-execution)
  - [Smoke Test Suite for Pull Requests](#smoke-test-suite-for-pull-requests)
- [Ensuring Tests Are Stable](#ensuring-tests-are-stable)
- [Workers](#workers)
- [Debugging Tests](#debugging-tests)
- [Commit Message Convention](#commit-message-convention)
- [Code Quality and Format](#code-quality-and-format)
  - [ESLint](#eslint)
  - [Prettier](#prettier)
  - [Husky](#husky)


## Prerequisites
- Node.js (v20.10.0)
- npm (latest is 10.2.1)
## Setup

1. Navigate to the project directory:

   ```
   cd playwright
   ```

2. Install dependencies:

   ```
   npm install
   ```

3. Ensure Husky is installed by running:

   ```
   npx husky install
   ```

4. Install Playwright Browsers (needed on new playwright install only)

   ```
   npx playwright install
   ```

## Usual Development Workflow

1. Create a new branch from `dev` with a meaningful name (e.g., `add-login-feature`)
2. Write your code
3. Run tests locally (see [Running Tests](#running-tests) section)
4. Ensure the tests are stable (see [Ensuring Tests are Stable](#ensuring-tests-are-stable) section)
5. Check if ESLint or Prettier are not complaining (see [ESLint](#eslint) and [Prettier](#prettier) sections)
6. Commit your changes if all good (see [Commit Message Convention](#commit-message-convention) section)
7. Push your changes to the remote repository (see [Husky](#husky) section)
8. Create a pull request to merge your branch into `dev`
9. Assign reviewers
10. Wait for the code review
11. Fix the change-requests if any
12. Merge your branch into `dev`

## Running Tests and Reports

You can select between two different projects, the following commands include desktop-chrome but you can use mobile.
This will depend on what you need.

- desktop-chrome.
- mobile-chrome

### Local execution

To run tests with Playwright, you can use the following commands:

- Run all tests: `npx playwright test --project='desktop-chrome'` or `npm run test:desktop-chrome` (this will run tests on dev environment)
- Run tests on custom branch `npm run test:custom-branch:desktop-chrome`
- Run a single test file: `npx playwright test --project='desktop-chrome' your-test.spec.js`
- Run a set of test files: `npx playwright test --project='desktop-chrome' tests/folder_here/`
- Run files that have `test` or `trial` in the file name: `npx playwright test --project='desktop-chrome' test trial`
- Run the test with the title: `npx playwright test --project='desktop-chrome' -g "jurence's tests"`
- Run tests in headed mode: `npx playwright test --project='desktop-chrome' your-test.spec.js --headed`

You can find the scripts in package.json file.

#### Test Report

Test reports can be found in the `/test-results` directory and `/playwright-report` after test execution.
To see generated report, run: `npm run report`

## Ensuring Tests Are Stable

To ensure that tests are stable, you can use the following commands:

```
npm run flaky <name of your test file>
```

##### Notice:

`<name of your test file>` can be just a part of the name of the test file.
It doesn't need to be a full path to the file

###### Example:

```
npm run flaky example-test-file-name
```

This line of code will run all the tests 5 times and report the flaky tests. If a test fails once but then passes it will be marked as flaky. This command uses 80% of the total system CPU cores (for example, 2 cores on a 3 core machine, 8 on a 10 core machine).

If you want to change the number of workers, you can do so by setting the WORKERS environment variable.

## Workers

The workers setting controls the number of tests that will run concurrently on your system (or in an environment). Our settings use the environment variable `WORKERS` with a default setting of `"80%"`. You may set this to a percentage or to a number.

By default this will use a number of workers less than 80% of the total CPU cores. If you have 3 cores, it will use 2, is you have 10, it will use 8, and so on.

If you wish to override the number of workers, you may do so by setting the WORKERS environment variable. For example, to run `flaky` with a single worker, you would use this command:

```
WORKERS=1 npm run flaky
```

You probably shouldn't use 100% of your cores — if you do your system will become almost completely unresponsive.

## Debugging Tests

To debug tests with Playwright, you can use the following commands:

- Debug all tests: `npx playwright test --project='desktop-chrome' --debug` or `npm run debug`
- Debug one test file: `npx playwright test --project='desktop-chrome' example.spec.js --debug`
- Debug a test from the line number where the test is defined: `npx playwright test --project='desktop-chrome' example.spec.js:10 --debug`
- Use the Playwright Inspector to step through Playwright API calls, see their debug logs, and explore locators. Run your tests with the `--debug` flag to open the inspector.
- Use the Playwright Trace Viewer to explore recorded Playwright traces of your tests. You can go back and forth through each action and visually see what was happening during each action. Run your tests with the `--trace on` flag to generate a trace file. Then open the trace file in the trace viewer.

## Commit Message Convention

We will be following the pattern: `[TYPE]([SCOPE]): [Subject]`

- **TYPE**: Type of change (e.g., `feat`, `fix`, `chore`, `docs`, `style`, `refactor`, `test`)
- **SCOPE**: Area or component affected (e.g., `UI`, `Backend`, `DB`, `Auth`) - it is optional field (use if needed)
- **Subject**: Brief description of the change (e.g., `Add login feature`) - use imperative verb mode

##### Examples

- `feat(UI): add login button`
- `fix(DB): resolve data inconsistency`
- `chore(tests): update Cypress dependencies`
- `refactor(Auth): use JWT for authentication`
- `test(API): add test cases for user registration`

##### Additional Notes

- Use imperative mood: `add` instead of "added", `fix` instead of "fixed"
- Limit subject to 50 characters
- Type in lowercase, except for acronyms like `UI`, `API`, etc.

## Code quality and format

### ESLint

This project uses ESLint for maintaining code quality. We will use https://github.com/airbnb/javascript as a base style guide.

To check for linting issues, run:

```
npm run lint
```

To automatically fix issues, run:

```
npm run lint-fix
```

### Prettier

This project uses Prettier for code formatting.

To format your code, run:

```
npm run format-fix
```

To just check formatting, run:

```
npm run format
```

### Husky

This project uses Husky for enforcing quality checks before commits.

It is possible that if you have not adjusted your code to the coding standards, the commit will be aborted.

In case of any errors, Husky will give you the line on which the error occurred. Please follow our coding guidelines.

**_Activation_**: Husky hooks are usually activated automatically upon `npm install`. If not, run `npx husky install` to set them up manually.

#### Workflow

The `pre-commit` hook will run before each commit and execute the following tasks:

- ESLint with auto-fix (`npm run lint-fix`)
- Prettier formatting (`npm run format`)

If any of these tasks fail, the commit will be aborted.

## Contribution Guidelines

- Use meaningful commit messages.
- Follow the commit message convention.
- Use meaningful branch names.
- Use meaningful variable names.
- Follow the coding standards and linting rules.
- Create a pull request for each new feature or bugfix.
- Make sure the build is passing before requesting a review.
- Remember about adding new documentation if needed.
- Remember about updating the README.md file if needed.
