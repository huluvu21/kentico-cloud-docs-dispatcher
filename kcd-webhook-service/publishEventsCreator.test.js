const publishEventsCreator = require('./publishEventsCreator');

const eventGridClient = {
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
        eventGridClient,
        host: fakeHost,
    };

    await publishEventsCreator(deps)(events);
    
    expect(eventGridClient.publishEvents.mock.calls[0][0]).toBe(host);
    expect(eventGridClient.publishEvents.mock.calls[0][1]).toBe(events);
  });
});