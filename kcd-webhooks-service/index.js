const EventGridClient = require('azure-eventgrid');
const msRestAzure = require('ms-rest-azure');
const publishEventsCreator = require('./publishEventsCreator');
const eventComposer = require('./eventComposer');

module.exports = async (context, request) => {
    if (request.query.source !== 'kentico' && request.query.source !== 'initialize') {        
        context.res = {
            status: 400,
            body: 'Request not valid'
        };

        return;
    } 

    const topicCredentials = new msRestAzure.TopicCredentials(process.env['EVENT_DOCS_CHANGED_KEY']);
    const eventGridClient = new EventGridClient(topicCredentials);
    const publishEvents = publishEventsCreator({eventGridClient, host: process.env['EVENT_DOCS_CHANGED_ENDPOINT']});        

    await publishEvents([eventComposer(request.body, request.query.source)]);
        
    context.res = {
        status: 200,
        body: 'Published successfully'
    }
};