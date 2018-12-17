module.exports = (request) =>
    (request.query.source === 'kentico' && request.body) || request.query.source === 'initialize';
        