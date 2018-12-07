const publishEventsCreator = require('./publishEventsCreator');

const EGClient = {
    publishEvents: jest.fn()
}
const host = 'fake.url-to-webhook.cloud';
const fakeHost = `http://${host}/api/webhook`;
const events =[{
    subject: 'test',
    eventType: 'test_event',
    dataVersion: '1.0',
    data: { xxx: 'xxx' },
    eventTime: new Date()
}];

describe('publishEvents', () => {
  test('calls publishEvents with correct host and events', async () => {
    const deps = {
        EGClient,
        host: fakeHost,
    };

    await publishEventsCreator(deps)(events);
    
    expect(EGClient.publishEvents.mock.calls[0][0]).toBe(host);
    expect(EGClient.publishEvents.mock.calls[0][1]).toBe(events);
  });
});