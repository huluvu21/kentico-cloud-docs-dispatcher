const EventGridClient = require('azure-eventgrid');
const msRestAzure = require('ms-rest-azure');
const uuid = require('uuid');
const url = require('url');

module.exports = async function (context, req) {
    context.log('JavaScript HTTP trigger function processed a request.');

    if (req.query.source !== 'kentico' && req.query.source !== 'github') {        
        context.res = {
            status: 400,
            body: 'Unknown webhook source'
        };
        context.done();

        return;
    }
    
    try {
        await pushToEventGrid(req.body, `${req.query.source}_webhook`);
        
        context.log('Event published successfully');
        context.res = {
            status: 200
        }
    } catch (error) {
        context.log(`And error ocurred: ${err}`);
        context.res = {
            status: 400,
            body: 'Unable to brodcast webhook'
        };
    }
    
    context.done();
};

async function pushToEventGrid(webhookBody, eventType) {
    const topicCredentials = new msRestAzure.TopicCredentials(process.env['EVENT_DOCS_CHANGED_KEY']);
    const EGClient = new EventGridClient(topicCredentials);
    const docsChangedHost = url.parse(process.env['EVENT_DOCS_CHANGED_ENDPOINT'], true).host;
    const currentDate = new Date();

    let events = [
        {
            id: uuid.v4(),
            subject: webhookBody.message.operation,
            eventType: eventType,
            dataVersion: '1.0',
            data: webhookBody.data.items,
            eventTime: currentDate
        }
    ]

    return EGClient.publishEvents(docsChangedHost, events);
}