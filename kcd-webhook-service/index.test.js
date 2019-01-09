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

  test('returns 200 but does nothing on kentico and content_item', async () => {
    const request = {
        query: {
            source: 'kentico'
        },
        body: {
            message: {
                type: 'content_item'
            }
        }
    };
    const context = {
        res: null,
        done: jest.fn()
    };

    await azureFunction(context, request);
    
    expect(context.res.status).toBe(200);
    expect(context.res.body).toBe('Nothing published');
  });
});