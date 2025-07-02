import { SearchIndexClient } from "@azure/search-documents";
import { searchEndpoint, indexName, credential } from "./config.js";

const indexClient = new SearchIndexClient(searchEndpoint, credential);

console.log(`Deleting search index: ${indexName}`);

try {
    await indexClient.deleteIndex(indexName);
    console.log(`Index '${indexName}' deleted successfully`);
} catch (error: any) {
    if (error.statusCode === 404) {
        console.log(`Index '${indexName}' does not exist`);
    } else {
        console.error("Error deleting index:", error);
        throw error;
    }
}
