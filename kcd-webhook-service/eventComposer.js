const getUuid = require('uuid').v4;

module.exports = (webhookBody, eventType) => {
    const dataFromWebhook = eventType === 'kentico' ?
        { 
            subject: webhookBody.message.operation,
            data: webhookBody.data
        } :
        {
            subject: eventType,
            data: {}
        };

    return {
        id: getUuid(),
        subject: dataFromWebhook.subject,
        eventType: eventType,
        dataVersion: '1.0',
        data: dataFromWebhook.data,
        eventTime: new Date()
    };
};