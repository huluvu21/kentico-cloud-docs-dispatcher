const publishEventsCreator = require('./publishEventsCreator');

const EGClient = {
    publishEvents: jest.fn()
}
const host = 'fake.url-to-webhook.cloud';
const fakeHost = `http://${host}/api/webhook`;
const eventType = 'test_webhook';
const webhookBody = {
    message: {
        operation: 'test_operation'
    },
    data: {
        xxx: 'xxx',
        yyy: 'yyy',
        zzz: 'zzz'
    }
};

describe('publishEvents', () => {
  test('calls publishEvents with correct host and event data', async () => {
    const deps = {
        EGClient,
        host: fakeHost,
    };

    await publishEventsCreator(deps)(webhookBody, eventType);

    const events = EGClient.publishEvents.mock.calls[0][1];
    expect(EGClient.publishEvents.mock.calls[0][0]).toBe(host);
    expect(events.length).toBe(1);
    expect(events[0].subject).toBe(webhookBody.message.operation);
    expect(events[0].eventType).toBe(eventType);
    expect(events[0].data).toBe(webhookBody.data);
  });
});