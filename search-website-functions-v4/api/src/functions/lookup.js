const { SearchClient, AzureKeyCredential } = require("@azure/search-documents");
const { app } = require('@azure/functions');
const { CONFIG } = require("../lib/config");

// Create a SearchClient to send queries
const client = new SearchClient(
    `https://` + CONFIG.SearchServiceName + `.search.windows.net/`,
    CONFIG.SearchIndexName,
    new AzureKeyCredential(CONFIG.SearchApiQueryKey)
);

app.http('lookup', {
    methods: ['GET'],
    authLevel: 'anonymous',
    handler: async (request, context) => {
        context.log(`Lookup processed request for url "${request.url}"`);

        try {
            const id = request.query.get('id');
            console.log(id);

            if (!id) {
                return {
                    status: 404
                }
            }

            const document = await client.getDocument(id);

            return { jsonBody: { document: document } };

        } catch (error) {
            return {
                status: 400,
                jsonBody: {
                    innerStatusCode: error.statusCode || error.code,
                    error: error.details || error.message
                }
            }
        }
    }
});