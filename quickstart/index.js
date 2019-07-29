#!/usr/bin/env/node

const nconf = require('nconf')

function getAzureConfiguration() {
    const config = nconf.file({ file: 'azure_search_config.json' });
    if (config.get('serviceName') == '[SEARCH_SERVICE_NAME' || config.get('apiKey') == '[SEARCH_SERVICE_API_KEY]') {
        throw "You have not set the values in your azure_search_config.json file. Please change them to match your search service's values."
    }
    return config;
}

const run = async() => {
    try {
    const cfg = getAzureConfiguration();
    console.log("Hello, Node from CLI");
    } catch (x) {
        console.log(x);
    }

}

run();