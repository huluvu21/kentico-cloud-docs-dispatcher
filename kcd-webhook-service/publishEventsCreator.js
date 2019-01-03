const url = require('url');

module.exports = dependencies =>
    async (events) => {
        const docsChangedHost = url.parse(dependencies.host, true).host;
        return dependencies.eventGridClient.publishEvents(docsChangedHost, events);
    }