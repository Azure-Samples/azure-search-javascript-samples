import { SearchClient } from "@azure/search-documents";
import { vector } from "./queryVector.js";
import { DefaultAzureCredential } from "@azure/identity";

// const key = process.env.AZURE_SEARCH_KEY || "";
// const searchClient = new SearchClient(
//     searchEndpoint!,
//     indexName,
//     new AzureKeyCredential(key)
// );

export const searchEndpoint = process.env.AZURE_SEARCH_ENDPOINT;
export const indexName = process.env.AZURE_SEARCH_INDEX_NAME;

console.log(`Using Azure Search endpoint: ${searchEndpoint}`);
console.log(`Using index name: ${indexName}`);

const searchClient = new SearchClient(
    searchEndpoint,
    indexName,
    new DefaultAzureCredential()
);

try {

    const vectorQuery = {
        vector: vector,
        kNearestNeighborsCount: 5,
        fields: ["DescriptionVector"],
        kind: "vector",
        exhaustive: true

    };

    // Create hybrid search options with both vector query and search text
    const searchOptions = {
        top: 5,
        includeTotalCount: true,
        select: ["HotelId", "HotelName", "Description", "Category", "Tags"],
        vectorSearchOptions: {
            queries: [vectorQuery],
            filterMode: "postFilter" // Apply filter after vector similarity is calculated
        }
    };

    // Use search_text for keyword search (hybrid search = vector + keyword)
    const searchText = "historic hotel walk to restaurants and shopping";
    const results = await searchClient.search(searchText, searchOptions);            // Convert results to typed format and log for debugging

    console.log(`\n\nHybrid search found ${results.count} then limited to top ${searchOptions.top}`);

    for await (const result of results.results) {

        // Log each result
        const doc = result.document;

        console.log(`- Score: ${result.score}`);
        console.log(`  HotelId: ${doc.HotelId}`);
        console.log(`  HotelName: ${doc.HotelName}`);
        console.log(`  Description: ${doc.Description || 'N/A'}`);
        console.log(`  Category: ${doc.Category || 'N/A'}`);
        console.log(`  Tags: ${doc.Tags ? JSON.stringify(doc.Tags) : 'N/A'}\n`);
    }

} catch (ex) {
    console.error("Hybrid search failed:", ex);
    throw ex;
}