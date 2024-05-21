export default function generateCustomLayoutSimpleExample(summaryResults, maxNumberOfFailures) {
  const maxNumberOfFailureLength = 650;
  const fails = [];
  const meta = [];
  const passedAndFlaky = summaryResults.passed + summaryResults.flaky;

  const header = {
    type: 'section',
    text: {
      type: 'mrkdwn',
      text: '*Test results are ready :tada:*',
    },
  };
  const summary = {
    type: 'section',
    text: {
      type: 'mrkdwn',
      text: `✅ *${passedAndFlaky}* | ❌ *${summaryResults.failed}* | ⏩ *${summaryResults.skipped}*`,
    },
  };

  if (summaryResults.failures.length > 0) {
    fails.push({
      type: 'section',
      text: {
        type: 'mrkdwn',
        text: `*The following tests failed:*`,
      },
    });

    for (let i = 0; i < summaryResults.failures.length; i += 1) {
      const { failureReason, test } = summaryResults.failures[i];
      let formattedTestName = test;
      const textToRemove = '[Project Name: desktop-chrome] using chromium';
      const empty = '';
      if (test.includes(textToRemove)) {
        formattedTestName = `${test.replace(textToRemove, empty).trim()}`;
      }
      failureReason
        .substring(0, maxNumberOfFailureLength)
        .split('\n')
        .map((l) => `>${l}`)
        .join('\n');
      fails.push({
        type: 'section',
        text: {
          type: 'mrkdwn',
          text: `${formattedTestName}`,
        },
      });

      if (i > maxNumberOfFailures) {
        fails.push({
          type: 'section',
          text: {
            type: 'mrkdwn',
            text: `*There are too many failures to display - ${fails.length} out of ${summaryResults.failures.length} failures shown*`,
          },
        });
        break;
      }
    }
  }

  if (summaryResults.meta != null) {
    for (let i = 0; i < summaryResults.meta.length; i += 1) {
      const { key, value } = summaryResults.meta[i];
      meta.push({
        type: 'section',
        text: {
          type: 'mrkdwn',
          text: `\n*${key}* :\t${value}`,
        },
      });
    }
  }

  return [
    header,
    summary,
    ...meta,
    {
      type: 'divider',
    },
    ...fails,
  ];
}
