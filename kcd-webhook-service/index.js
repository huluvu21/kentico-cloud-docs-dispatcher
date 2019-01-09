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

    if (request.query.source === 'kentico' && request.body.message.type === 'content_item') {          
        context.res = {
            status: 200,
            body: 'Nothing published'
        };

        return;
    }

    const topicCredentials = new msRestAzure.TopicCredentials(process.env['EventGrid.DocsChanged.Key']);
    const eventGridClient = new EventGridClient(topicCredentials);
    const publishEvents = publishEventsCreator({eventGridClient, host: process.env['EventGrid.DocsChanged.Endpoint']});        

    await publishEvents([eventComposer(request.body, request.query.source)]);
        
    context.res = {
        status: 200,
        body: 'Published successfully'
    };
};