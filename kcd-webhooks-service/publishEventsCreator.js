const url = require('url');
const getUuid = require('uuid').v4;

module.exports = dependencies =>
    async (webhookBody, eventType) => {
        const docsChangedHost = url.parse(dependencies.host, true).host;

        const events = [
            {
                id: getUuid(),
                subject: webhookBody.message.operation,
                eventType: eventType,
                dataVersion: '1.0',
                data: webhookBody.data,
                eventTime: new Date()
            }
        ];

        return dependencies.EGClient.publishEvents(docsChangedHost, events);
    }