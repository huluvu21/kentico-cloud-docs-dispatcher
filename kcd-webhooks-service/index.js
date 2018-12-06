const EventGridClient = require('azure-eventgrid');
const msRestAzure = require('ms-rest-azure');
const publishEventsCreator = require('./publishEventsCreator');

module.exports = async (context, req) => {
    if (req.query.source === 'kentico') {        
        const topicCredentials = new msRestAzure.TopicCredentials(process.env['EVENT_DOCS_CHANGED_KEY']);
        const EGClient = new EventGridClient(topicCredentials);
        const publishEvents = publishEventsCreator({EGClient, host: process.env['EVENT_DOCS_CHANGED_ENDPOINT']});        

        try {
            await publishEvents(req.body, `${req.query.source}_webhook`);
            
            context.res = {
                status: 200,
                body: 'Published successfully'
            }
        } catch (error) {
            context.log(error);
            context.res = {
                status: 500,
                body: 'Unable to brodcast webhook'
            };
        }
    }
    else {   
        context.res = {
            status: 400,
            body: 'Unknown webhook source'
        };
    }
    
    context.log(context.res.body);
};