import { SearchClient } from "@azure/search-documents";
import { vector } from "./queryVector.js";
import { DefaultAzureCredential } from "@azure/identity";

export const searchEndpoint = process.env.AZURE_SEARCH_ENDPOINT;
export const indexName = process.env.AZURE_SEARCH_INDEX_NAME;

console.log(`Using Azure Search endpoint: ${searchEndpoint}`);
console.log(`Using index name: ${indexName}`);

// const key = process.env.AZURE_SEARCH_KEY || "";
// const searchClient = new SearchClient(
//     searchEndpoint!,
//     indexName,
//     new AzureKeyCredential(key)
// );

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

    // Create a vector search options with the vector query and filter
    const searchOptions = {
        top: 7,
        select: ["HotelId", "HotelName", "Description", "Category", "Tags"] ,
        includeTotalCount: true,
        filter: "Tags/any(tag: tag eq 'free wifi')", // Adding filter for "free wifi" tag
        vectorSearchOptions: {
            queries: [vectorQuery],
            filterMode: "postFilter" // Apply filter after vector similarity is calculated
        }
    };
    const results = await searchClient.search("*", searchOptions);

    console.log(`\n\nSingle Vector search found ${results.count}`);

    for await (const result of results.results) {
        // Log each result
        const doc = result.document;
        console.log(`- HotelId: ${doc.HotelId}, HotelName: ${doc.HotelName}, Tags: ${doc.Tags ? JSON.stringify(doc.Tags) : 'N/A'}, Score ${result.score}`);
    }

} catch (ex) {
    console.error("Vector search failed:", ex);
    throw ex;
}
