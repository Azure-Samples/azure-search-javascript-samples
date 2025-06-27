import { DefaultAzureCredential } from "@azure/identity";
import {
    SearchIndexClient
} from "@azure/search-documents";

const credential = new DefaultAzureCredential();
export const searchEndpoint = process.env.AZURE_SEARCH_ENDPOINT!;
export const indexName = process.env.AZURE_SEARCH_INDEX_NAME!;

console.log(`Using Azure Search endpoint: ${searchEndpoint}`);
console.log(`Using index name: ${indexName}`);

const searchIndexClient = new SearchIndexClient(searchEndpoint, credential);

try {
    console.log("Deleting index...");
    await searchIndexClient.deleteIndex(indexName);
    console.log(`Index ${indexName} deleted`);
} catch (ex) {
    console.error("Failed to delete index:", ex);
}