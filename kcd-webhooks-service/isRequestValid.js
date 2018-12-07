module.exports = (request) =>
    request.query.key === process.env['QUERY_KEY'] &&
    ((request.query.source === 'kentico' && request.body) || request.query.source === 'initialize');
        