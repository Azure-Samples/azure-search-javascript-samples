// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.

// Importing the @azure/search-documents library
const { SearchIndexClient, SearchClient, AzureKeyCredential, odata } = require("@azure/search-documents");

// Importing the index definition and sample data
const hotelData = require('./hotels.json');
const indexDefinition = require('./hotels_quickstart_index.json');

// Load the .env file if it exists
require("dotenv").config();

// Getting endpoint and apiKey from .env file
const endpoint = process.env.SEARCH_API_ENDPOINT || "";
const apiKey = process.env.SEARCH_API_KEY || "";

async function main() {
    console.log(`Running Azure AI Search Javascript quickstart...`);
    if (!endpoint || !apiKey) {
        console.log("Make sure to set valid values for endpoint and apiKey with proper authorization.");
        return;
    }

    // Creating an index client to create the search index
    const indexClient = new SearchIndexClient(endpoint, new AzureKeyCredential(apiKey));

    // Getting the name of the index from the index definition
    const indexName = indexDefinition["name"];

    console.log('Checking if index exists...');
    await deleteIndexIfExists(indexClient, indexName);

    console.log('Creating index...');
    let index = await indexClient.createIndex(indexDefinition);
    console.log(`Index named ${index.name} has been created.`);

    // Creating a search client to upload documents and issue queries
    const searchClient = indexClient.getSearchClient(indexName);

    console.log('Uploading documents...');
    let indexDocumentsResult = await searchClient.mergeOrUploadDocuments(hotelData['value']);
    console.log(`Index operations succeeded: ${JSON.stringify(indexDocumentsResult.results[0].succeeded)} `);

    // waiting one second for indexing to complete (for demo purposes only)
    sleep(1000);

    console.log('Querying the index...');
    console.log();
    await sendQueries(searchClient);
}

async function deleteIndexIfExists(indexClient, indexName) {
    try {
        await indexClient.deleteIndex(indexName);
        console.log('Deleting index...');
    } catch {
        console.log('Index does not exist yet.');
    }
}

async function sendQueries(searchClient) {
    // Query 1
    console.log('Query #1 - search everything:');
    let searchOptions = {
        includeTotalCount: true,
        select: ["HotelId", "HotelName", "Rating"]
    };

    let searchResults = await searchClient.search("*", searchOptions);
    for await (const result of searchResults.results) {
        console.log(`${JSON.stringify(result.document)}`);
    }
    console.log(`Result count: ${searchResults.count}`);
    console.log();


    // Query 2
    console.log('Query #2 - search with filter, orderBy, and select:');
    let state = 'FL';
    searchOptions = {
        filter: odata`Address/StateProvince eq ${state}`,
        orderBy: ["Rating desc"],
        select: ["HotelId", "HotelName", "Rating"]
    };

    searchResults = await searchClient.search("wifi", searchOptions);
    for await (const result of searchResults.results) {
        console.log(`${JSON.stringify(result.document)}`);
    }
    console.log();

    // Query 3
    console.log('Query #3 - limit searchFields:');
    searchOptions = {
        select: ["HotelId", "HotelName", "Rating"],
        searchFields: ["HotelName"]
    };

    searchResults = await searchClient.search("sublime cliff", searchOptions);
    for await (const result of searchResults.results) {
        console.log(`${JSON.stringify(result.document)}`);
    }
    console.log();

    // Query 4
    console.log('Query #4 - limit searchFields and use facets:');
    searchOptions = {
        facets: ["Category"],
        select: ["HotelId", "HotelName", "Rating"],
        searchFields: ["HotelName"]
    };

    searchResults = await searchClient.search("*", searchOptions);
    for await (const result of searchResults.results) {
        console.log(`${JSON.stringify(result.document)}`);
    }
    console.log();

    // Query 5
    console.log('Query #5 - Lookup document:');
    let documentResult = await searchClient.getDocument(key='3')
    console.log(`HotelId: ${documentResult.HotelId}; HotelName: ${documentResult.HotelName}`)
    console.log();
}

function sleep(ms) {
    var d = new Date();
    var d2 = null;
    do {
        d2 = new Date();
    } while (d2 - d < ms);
}

main().catch((err) => {
    console.error("The sample encountered an error:", err);
});