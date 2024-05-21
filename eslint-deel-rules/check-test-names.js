// We need to use CommonJS Syntax for Eslint to work with this file
module.exports = {
  meta: {
    type: 'problem',
    docs: {
      description: 'ensure test titles contain "@" symbol',
      category: 'Custom Rules',
      recommended: false,
    },
    fixable: null,
    schema: [],
  },
  create(context) {
    return {
      CallExpression(node) {
        if (node.callee.type === 'Identifier' && node.callee.name === 'test') {
          const firstArgument = node.arguments[0];
          let testName;

          // Check if the first argument is a TemplateLiteral, it is ` `
          if (firstArgument && firstArgument.type === 'TemplateLiteral') {
            // Extract the string parts and join them to get the full test name
            testName = firstArgument.quasis.map((part) => part.value.cooked).join('');
          }

          // Check if the first argument is a Literal (string), it is ' '
          else if (firstArgument && firstArgument.type === 'Literal' && typeof firstArgument.value === 'string') {
            testName = firstArgument.value;
          }

          // If a testName was found and it does not include '@', report the error
          if (testName && !testName.includes('@')) {
            context.report({
              node: firstArgument,
              message: "Test title '{{ testName }}' does not contain '@'",
              data: {
                testName,
              },
            });
          }
        }
      },
    };
  },
};
