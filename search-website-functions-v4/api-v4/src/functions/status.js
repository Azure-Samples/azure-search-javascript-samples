const { app } = require('@azure/functions');
const { CONFIG } = require("../lib/config");

app.http('status', {
    methods: ['GET', 'POST'],
    authLevel: 'anonymous',
    handler: async (request, context) => {
        context.log(`Status processed request for url "${request.url}"`);
        return { jsonBody: { results: CONFIG } };
    }
});
