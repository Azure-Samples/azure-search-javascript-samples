const { app } = require('@azure/functions');
const { SearchClient, AzureKeyCredential } = require("@azure/search-documents");
const { CONFIG } = require("../lib/config");

// Create a SearchClient to send queries
const client = new SearchClient(
    `https://` + CONFIG.SearchServiceName + `.search.windows.net/`,
    CONFIG.SearchIndexName,
    new AzureKeyCredential(CONFIG.SearchApiQueryKey)
);

app.http('suggest', {
    methods: ['POST'],
    authLevel: 'anonymous',
    handler: async (request, context) => {
        context.log(`Suggester request for url "${request.url}"`);
        try {
            const body = await request.json();
            console.log(`suggest body ${body}`);

            let q = body.q;
            console.log(`suggest q ${q}`)

            const top = body.top;
            console.log(`suggest top ${top}`)

            const suggester = body.suggester;
            console.log(`suggest suggester ${suggester}`)

            if(!body || !q || !top || !suggester){
                console.log(`No suggester found in body`)
                return {
                    status: 404,
                    body: "No suggester found"
                }
            }

            // Let's get the top 5 suggestions for that search term
            const suggestions = await client.suggest(q, suggester, { top: parseInt(top) });
            //const suggestions = await client.autocomplete(q, suggester, {top: parseInt(top)});

            context.log(suggestions);

            return {
                headers: {
                    "Content-type": "application/json"
                },
                jsonBody: { 
                    suggestions: suggestions.results,
                    q, 
                    top,
                    suggester 

                }
            }
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
