#!/usr/bin/env/node

const nconf = require('nconf');
const SearchServiceHelper = require('./SearchServiceHelper.js');
const AzureSearchClient = require('./AzureSearchClient.js');

function getAzureConfiguration() {
    const config = nconf.file({ file: 'azure_search_config.json' });
    if (config.get('serviceName') == '[SEARCH_SERVICE_NAME' || config.get('apiKey') == '[SEARCH_SERVICE_API_KEY]') {
        throw "You have not set the values in your azure_search_config.json file. Please change them to match your search service's values."
    }
    return config;
}

const run = () => {
    try {
        const cfg = getAzureConfiguration();
        const helper = new SearchServiceHelper(cfg.get("serviceName"), cfg.get("apiKey"), "hotels");
        const client = new AzureSearchClient(helper);
        if (client.indexExists()) {
            client.deleteIndex();
         }
      
        const indexDefinition = require('./hotels_quickstart_index.json');
        client.createIndex(indexDefinition);
    } catch (x) {
        console.log(x);
    }

}

run();