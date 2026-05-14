// File generated from our OpenAPI spec by Stainless. See CONTRIBUTING.md for details.

import XtraceMemoryManager from 'xtrace-memory-manager';

const client = new XtraceMemoryManager({
  apiKey: 'My API Key',
  orgID: 'My Org ID',
  baseURL: process.env['TEST_API_BASE_URL'] ?? 'http://127.0.0.1:4010',
});

describe('resource usage', () => {
  // Mock server tests are disabled
  test.skip('retrieve', async () => {
    const responsePromise = client.usage.retrieve();
    const rawResponse = await responsePromise.asResponse();
    expect(rawResponse).toBeInstanceOf(Response);
    const response = await responsePromise;
    expect(response).not.toBeInstanceOf(Response);
    const dataAndResponse = await responsePromise.withResponse();
    expect(dataAndResponse.data).toBe(response);
    expect(dataAndResponse.response).toBe(rawResponse);
  });
});
