#!/usr/bin/env/node

const nconf = require('nconf');
const AzureSearchClient = require('./AzureSearchClient.js');

function getAzureConfiguration() {
    const config = nconf.file({ file: 'azure_search_config.json' });
    if (config.get('serviceName') == '[SEARCH_SERVICE_NAME' || config.get('adminKey') == '[SEARCH_SERVICE_API_KEY]') {
        throw new Error("You have not set the values in your azure_search_config.json file. Please change them to match your search service's values.");
    }
    return config;
}

const queries = [
    "*&$count=true",
    "historic&$filter=Rating gt 4&"
];

const hotelData = { value : [
    require('./data/hotel1.json'),
    require('./data/hotel2.json'),
    require('./data/hotel3.json'),
    require('./data/hotel4.json')
]}


function sleep(ms)
{
    return(
        new Promise(function(resolve, reject)
        {
            setTimeout(function() { resolve(); }, ms);
        })
    );
}
async function doQueries(client) {
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
        const client = new AzureSearchClient(cfg.get("serviceName"), cfg.get("adminKey"), cfg.get("queryKey"), "hotels");
        
        const exists = await client.indexExistsAsync();
        await exists ? client.deleteIndexAsync() : Promise.resolve();
        // Deleting index can take a few seconds
        await sleep(2000);
        const indexDefinition = require('./hotels_quickstart_index.json');
        await client.createIndexAsync(indexDefinition);
        // Index availability can take a few seconds
        await sleep(2000);
        await client.postDataAsync(hotelData);
        // Data availability can take a few seconds
        await sleep(5000);
        await doQueries(client);
    } catch (x) {
        console.log(x);
    }

}

run();