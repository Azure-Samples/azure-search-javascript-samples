import {
    SearchIndexClient
} from "@azure/search-documents";
import { searchEndpoint, indexName, credential } from "./config.js";

const indexClient = new SearchIndexClient(searchEndpoint, credential);

console.log('Updating semantic search index...');

// Get the existing schema
const index = await indexClient.getIndex(indexName);

console.log(`Index name: ${index.name}`);
console.log(`Number of fields: ${index.fields.length}`);

for(const field of index.fields) {

    // @ts-ignore
    console.log(`Field: ${field.name}, Type: ${field.type}, Searchable: ${field.searchable}`);
}

if(index.semanticSearch && index.semanticSearch.configurations) {
    console.log(`Semantic search configurations: ${index.semanticSearch.configurations.length}`);
    for(const config of index.semanticSearch.configurations) {
        console.log(`Configuration name: ${config.name}`);
        console.log(`Title field: ${config.prioritizedFields.titleField?.name}`);
    }
} else {
    console.log("No semantic configuration exists for this index.");
}