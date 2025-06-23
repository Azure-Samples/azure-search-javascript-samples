import { DefaultAzureCredential } from "@azure/identity";
import * as dotenv from "dotenv";
import * as process from "process";
import { 
    SearchIndexClient, 
    SearchIndex,
    SearchClient
} from "@azure/search-documents";
import { DOCUMENTS } from "./documents.js";
import { SCHEMA } from "./schema.js";
import { QUERY_VECTOR } from "./queryVector.js";
import * as VectorSearch from './search.js';

const searchEndpoint = process.env.AZURE_SEARCH_ENDPOINT!;
const credential = new DefaultAzureCredential();
const indexName = process.env.AZURE_SEARCH_INDEX || "vector-search-quickstart";

const indexDefinition = SCHEMA;

async function createIndex(): Promise<SearchIndexClient> {

    const indexClient = new SearchIndexClient(searchEndpoint, credential);
    
    console.log('Creating index...');
    const result = await indexClient.createOrUpdateIndex(indexDefinition as any);
    console.log(`${result.name} created`);

    return indexClient;
}
async function deleteIndex(searchIndexClient: SearchIndexClient): Promise<void> {
    const indexClient = new SearchIndexClient(searchEndpoint, credential);
    
    try {
        console.log("Deleting index...");
        await searchIndexClient.deleteIndex(indexName);
        console.log(`Index ${indexName} deleted`);
    } catch (ex) {
        console.error("Failed to delete index:", ex);
    }
}
async function uploadDocuments(): Promise<void> {
    const searchClient = new SearchClient(searchEndpoint, indexName, credential);
    
    try {
        console.log("Uploading documents...");
        const result = await searchClient.uploadDocuments(DOCUMENTS);
        for (const r of result.results) {
            console.log(`Key: ${r.key}, Succeeded: ${r.succeeded}, ErrorMessage: ${r.errorMessage || 'none'}`);
        }
    } catch (ex) {
        console.error("Failed to upload documents:", ex);
    }
}

async function main(): Promise<void> {
    try {
        const searchIndexClient = await createIndex();
        //await uploadDocuments();
        //await VectorSearch.singleVectorSearch(QUERY_VECTOR);
        //await VectorSearch.singleVectorSearchWithFilter(QUERY_VECTOR);
        //await VectorSearch.vectorQueryWithGeoFilter(QUERY_VECTOR);
        //await VectorSearch.hybridSearch(QUERY_VECTOR);
        //await VectorSearch.semanticHybridSearch(QUERY_VECTOR);
        await deleteIndex(searchIndexClient);
    } catch (error) {
        console.error("Error:", error);
    }
}

// Run the main function if this file is executed directly
if (require.main === module) {
    main().catch(console.error);
}

// Export the functions for use in other modules
export { createIndex, uploadDocuments };