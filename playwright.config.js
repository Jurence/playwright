import { defineConfig, devices } from '@playwright/test';
import dotenv from 'dotenv';
import selectReporters from './utils/select-reporters';
import slackLayout from './utils/slackLayout';

/**
 * Read environment variables from file.
 * https://github.com/motdotla/dotenv
 * Default env is dev
 */
dotenv.config({
  path: process.env.ENV ? `./env/.env.${process.env.ENV}` : './env/.env.dev',
});
const workersRaw = process.env.WORKERS ? process.env.WORKERS : '80%';
const workers = workersRaw.includes('%') ? workersRaw : parseInt(workersRaw.trim(), 10);

/* -Report variable-
 * Get current date, then use it as part of the report name.
 */
const currentDate = new Date().toISOString().slice(0, 10);

// Report Portal Configuration
const RPconfig = {
  apiKey: process.env.REPORT_PORTAL_API_KEY,
  endpoint: process.env.REPORT_PORTAL_ENDPOINT,
  project: process.env.REPORT_PORTAL_PROJECT,
  launch: process.env.REPORT_PORTAL_PROJECT_TITLE,
  includeTestSteps: true,
  attributes: [
    {
      key: 'Owner',
      value: process.env.GITHUB_USER_NAME,
    },
    {
      key: 'Environment',
      value: `${process.env.BASE_URL} and ${process.env.ADMIN_URL}`,
    },
    {
      key: 'Pipeline ID',
      value: process.env.GITHUB_PIPELINE_ID,
    },
  ],
  description: process.env.GITHUB_COMMIT_BRANCH,
  debug: false,
  skippedIssue: false,
  mode: 'DEFAULT',
};

// Select report based on specific conditions
const reporterSelected = selectReporters(RPconfig, currentDate, slackLayout);

/**
 * @see https://playwright.dev/docs/test-configuration
 */
export default defineConfig({
  testDir: './tests',
  fullyParallel: true,

  /* Disallow to use test.describe.only or test.only - even in the IDE */
  forbidOnly: true,

  /* Retry twice on CI only, otherwise retry once for TraceViewer to record your test run */
  retries: process.env.CI === 'true' ? 2 : 1,

  /* Run up to 2 parallel tests at the same time, both locally and on CI. More workers are killing DEV ENV */
  workers,

  /* 
  Time to wait for a page to load - currently 60 seconds. 
  If the test needs more time, you need to add a specific timeout in that test.
  */
  timeout: 60 * 1000,
  expect: {
    /* Consider a test to fail if assertion does not pass within 40 seconds. */
    timeout: 40 * 1000,
  },

  /*
  Timeout for the whole test run - 30 minutes.
  */
  globalTimeout: 30 * 60 * 1000,

  /* Reporter to use. See https://playwright.dev/docs/test-reporters and https://github.com/cenfun/monocart-reporter#readme */
  reporter: reporterSelected,

  /* Shared settings for all the projects below. See https://playwright.dev/docs/api/class-testoptions. */
  use: {
    /* Maximum time each action such as `click()` can take. Defaults to 0 (no limit). */
    actionTimeout: 0,

    /* Base URL to use in actions like `await page.goto('/')`. */
    baseURL: process.env.BASE_URL,

    /* Change the default data-testid to data-qa */
    testIdAttribute: 'data-qa',

    /* 
      Collect trace when retrying the failed test. See https://playwright.dev/docs/trace-viewer 
      For running the tests locally, you can modify option below to trace: 'on' 
      so it always records the trace when the tests are executed.
    */
    trace: process.env.CI === 'true' ? 'on-all-retries' : 'on',

    /* Collect screenshots in case of failure */
    screenshot: 'only-on-failure',
  },

  /* Configure projects, here you could also specify setup for different test env */
  /* For now use just Desktop Chrome browser and higher resolution than default */
  projects: [
    {
      name: 'setup',
      testMatch: 'client-global.setup.js',
    },
    {
      name: 'desktop-chrome',
      use: { ...devices['Desktop Chrome'], viewport: { width: 1440, height: 900 } },
      dependencies: ['setup'],
    },
    {
      name: 'mobile-chrome',
      use: { ...devices['Pixel 7'] },
      dependencies: ['setup'],
    },
  ],
});

export const { API_URL, ADMIN_URL, ADMIN_API_URL, ADMIN_TOKEN, EOR_ENTITY_PASSWORD, CLIENT_TOKEN } = process.env;
