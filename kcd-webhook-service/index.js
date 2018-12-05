const EventGridClient = require('azure-eventgrid');
const msRestAzure = require('ms-rest-azure');
const uuid = require('uuid');
const url = require('url');

module.exports = async function (context, req) {
    context.log('JavaScript HTTP trigger function processed a request.');

    if (req.query.name && req.query.message) {
        pushToEventGrid(req.query.name, 'test', {
            message: req.query.message
        });

        context.res = {
            // status: 200, /* Defaults to 200 */
            body: "Hello " + (req.query.name || req.body.name)
        };
    }
    else {
        context.res = {
            status: 400,
            body: "Please pass a name on the query string or in the request body"
        };
    }
};

/*
data: {
    field1: 'value1',
    filed2: 'value2'
}
*/
function pushToEventGrid(subject, eventType, data) {
    const topicCredentials = new msRestAzure.TopicCredentials(process.env['EVENT_DOCS_CHANGED_KEY']);
    const EGClient = new EventGridClient(topicCredentials);
    const docsChangedHost = url.parse(process.env['EVENT_DOCS_CHANGED_ENDPOINT'], true).host;
    const currentDate = new Date();

    let events = [
        {
            id: uuid.v4(),
            subject: subject,
            eventType: eventType,
            dataVersion: '1.0',
            data: data,
            eventTime: currentDate
        }
    ]

    EGClient.publishEvents(docsChangedHost, events)
    .then(_ => Promise.resolve(console.log('Published events successfully.')))
    .catch((err) => { console.log('An error ocurred ' + err); });
}