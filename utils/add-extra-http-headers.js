import { request } from '@playwright/test';

/**
 * Adds extra HTTP headers to an existing Playwright request fixture.
 *
 * @param {import('@playwright/test').APIRequestContext} requestContext - The existing Playwright request context.
 * @param {Object} extraHeaders - The extra HTTP headers to add.
 * @returns {Promise<RequestContext>} - A promise that resolves to the modified RequestContext.
 */
export async function addExtraHTTPHeaders(requestContext, extraHeaders) {
  // Clone the existing context options
  const contextOptions = { ...requestContext.options };

  // Merge the new headers with existing ones
  contextOptions.extraHTTPHeaders = {
    ...contextOptions.extraHTTPHeaders,
    ...extraHeaders,
  };

  const newContext = await request.newContext(contextOptions);

  // Create a new context with the merged headers
  return newContext;
}

/**
 * Creates a new APIRequestContext with an authentication token attached.
 *
 * @param {string} authToken - The authentication token to be added as an extra HTTP header.
 * @returns {Promise<playwright.APIRequestContext>} - The new request context with the authentication token.
 */
export async function createRequestContextWithAuthToken(authToken) {
  const context = await request.newContext({
    extraHTTPHeaders: {
      'x-auth-token': authToken,
    },
  });

  return context;
}
