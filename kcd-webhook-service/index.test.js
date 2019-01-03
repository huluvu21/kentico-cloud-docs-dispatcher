const azureFunction = require('./index');

describe('Azure function fails', () => {
  test('returns 400 on unknown event type', async () => {
    const request = {
        query: {
            source: 'unknown'
        }
    };
    const context = {
        res: null,
        done: jest.fn()
    };

    await azureFunction(context, request);
    
    expect(context.res.status).toBe(400);
    expect(context.res.body).toBe('Request not valid');
  });
});