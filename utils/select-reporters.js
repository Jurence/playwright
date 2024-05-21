export default function selectReporters(RPconfig, currentDate, slackLayout) {
  // If REPORT_PORTAL_PROJECT_TITLE is Smoke, we will use Playwright 'on-failure',  ReportPortal, Monocart and Slack
  if (process.env.REPORT_PORTAL_PROJECT_TITLE === 'Smoke Tests') {
    return [
      ['list'],

      /*
      * TODO: Send reports to Report Portal doesn't work because now RP has a VPN
      ['@reportportal/agent-js-playwright', RPconfig],
      */
      ['monocart-reporter', { name: `Playwright E2E Test Report ${currentDate}`, outputFile: `./test-results/report.html` }],
      [
        './node_modules/playwright-slack-report/dist/src/SlackReporter.js',
        {
          channels: [`${process.env.SLACK_CHANNEL}`],
          sendResults: 'on-failure',
          maxNumberOfFailuresToShow: 5,
          layout: slackLayout,
          meta: [
            {
              key: 'Environment',
              value: `${process.env.ENV}`,
            },
            {
              key: 'Suite',
              value: `${process.env.REPORT_PORTAL_PROJECT_TITLE}`,
            },
            {
              key: 'Owner',
              value: `${process.env.GITHUB_USER_NAME}`,
            },
            {
              key: 'Build',
              value: `<https://github.com/${process.env.GITHUB_REPOSITORY}/actions/runs/${process.env.GITHUB_RUN_ID}| View Build>`,
            },
            {
              key: 'Results',
              value: `Report Portal not available`,
            },
          ],
          slackOAuthToken: process.env.SLACK_BOT_USER_OAUTH_TOKEN,
        },
      ],
    ];
  }

  // If REPORT_PORTAL_PROJECT_TITLE is Regression, we will use Playwright 'always',  ReportPortal, TestMo, Monocart and Slack
  if (process.env.REPORT_PORTAL_PROJECT_TITLE === 'Regression') {
    return [
      ['list'],

      /*
      * TODO: Send reports to Report Portal doesn't work because now RP has a VPN
      ['@reportportal/agent-js-playwright', RPconfig],
      */
      [
        './node_modules/playwright-slack-report/dist/src/SlackReporter.js',
        {
          channels: [`${process.env.SLACK_CHANNEL}`],
          sendResults: 'always',
          maxNumberOfFailuresToShow: 5,
          layout: slackLayout,
          meta: [
            {
              key: 'Environment',
              value: `${process.env.ENV}`,
            },
            {
              key: 'Suite',
              value: `${process.env.REPORT_PORTAL_PROJECT_TITLE}`,
            },
            {
              key: 'Build',
              value: `<https://github.com/${process.env.GITHUB_REPOSITORY}/actions/runs/${process.env.GITHUB_RUN_ID}| View Build>`,
            },
            {
              key: 'Results',
              value: `Report Portal not available`,
            },
          ],
          slackOAuthToken: process.env.SLACK_BOT_USER_OAUTH_TOKEN,
        },
      ],
      ['monocart-reporter', { name: `Playwright E2E Test Report ${currentDate}`, outputFile: `./test-results/report.html` }],
      [
        'junit',
        {
          outputFile: 'results/test-results.xml',
          embedAnnotationsAsProperties: true,
        },
      ],
    ];
  }

  // If REPORT_PORTAL_PROJECT_TITLE is Regression, we will use Playwright 'always',  ReportPortal, TestMo, Monocart and Slack
  if (process.env.REPORT_PORTAL_PROJECT_TITLE === 'Regression RC') {
    return [
      ['list'],

      /*
      * TODO: Send reports to Report Portal doesn't work because now RP has a VPN 
      ['@reportportal/agent-js-playwright', RPconfig],
      */
      ['monocart-reporter', { name: `Playwright E2E Test Report ${currentDate}`, outputFile: `./test-results/report.html` }],
    ];
  }

  // If neither of the above conditions are met, we will use Playwright and Monocart - Usually for local executions
  return [
    ['list'],
    ['monocart-reporter', { name: `Playwright E2E Test Report ${currentDate}`, outputFile: `./test-results/report.html` }],
  ];
}
