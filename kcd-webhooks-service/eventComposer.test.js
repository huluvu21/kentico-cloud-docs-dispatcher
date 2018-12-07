const eventComposer = require('./eventComposer');

const webhookBody = {
    message: {
        operation: 'testing'
    },
    data: {
        xxx: 'xxx',
        yyy: 'yyy'
    }
};

describe('eventComposer', () => {
  test('compose event with data from webhook', async () => {
    const eventType = 'kentico';
    const event = eventComposer(webhookBody, eventType);
    
    expect(event.id).toBeTruthy;
    expect(event.subject).toBe(webhookBody.message.operation);
    expect(event.eventType).toBe(eventType);
    expect(event.dataVersion).toBe('1.0');
    expect(event.data).toBe(webhookBody.data);
    expect(event.eventTime).toBeTruthy;
  });
  
  test('compose event without', async () => {
    const eventType = 'notKentico';
    const event = eventComposer({}, eventType);
    
    expect(event.id).toBeTruthy;
    expect(event.subject).toBe(eventType);
    expect(event.eventType).toBe(eventType);
    expect(event.dataVersion).toBe('1.0');
    expect(event.data).toBeNull;
    expect(event.eventTime).toBeTruthy;
  });
});