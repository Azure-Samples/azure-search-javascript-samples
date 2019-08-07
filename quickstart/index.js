#!/usr/bin/env/node
const nconf = require('nconf');

const hotelData = require('./hotels.json');
const indexDefinition = require('./hotels_quickstart_index.json');
const AzureSearchClient = require('./AzureSearchClient.js');

const queries = [
    "*&$count=true",
    "historic&$filter=Rating gt 4&"
];

function getAzureConfiguration() {
    const config = nconf.file({ file: 'azure_search_config.json' });
    if (config.get('serviceName') === '[SEARCH_SERVICE_NAME') {
        throw new Error("You have not set the values in your azure_search_config.json file.Change them to match your search service's values.");
    }
    return config;
}

function sleep(ms)
{
    return(
        new Promise(function(resolve, reject)
        {
            setTimeout(function() { resolve(); }, ms);
        })
    );
}
async function doQueriesAsync(client) {
    return Promise.all(
        queries.map(async query => {
            const result = await client.queryAsync(query);
            const body = await result.json();
            const str = JSON.stringify(body, null, 4);
            console.log(`Query: ${query} \n ${str}`);
        })
    );
}

const run = async () => {
    try {
        const cfg = getAzureConfiguration();
        const client = new AzureSearchClient(cfg.get("serviceName"), cfg.get("adminKey"), cfg.get("queryKey"), cfg.get("indexName"));
        
        const exists = await client.indexExistsAsync();
        await exists ? client.deleteIndexAsync() : Promise.resolve();
        // Deleting index can take a few seconds
        await sleep(2000);
        await client.createIndexAsync(indexDefinition);
        // Index availability can take a few seconds
        await sleep(2000);
        await client.postDataAsync(hotelData);
        // Data availability can take a few seconds
        await sleep(5000);
        await doQueriesAsync(client);
    } catch (x) {
        console.log(x);
    }

}

run();