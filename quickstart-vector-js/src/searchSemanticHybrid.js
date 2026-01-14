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

    // Create semantic hybrid search options with vector query and semantic configuration
    const searchOptions = {
        top: 5,
        includeTotalCount: true,
        select: ["HotelId", "HotelName", "Category", "Description"],
        queryType: "semantic",
        semanticSearchOptions: {
            configurationName: "semantic-config"
        },
        vectorSearchOptions: {
            queries: [vectorQuery],
            filterMode: "postFilter" // Apply filter after vector similarity is calculated
        },
    };

    // Use search_text for semantic ranking
    const searchText = "historic hotel walk to restaurants and shopping";
    const results = await searchClient.search(searchText, searchOptions);

    console.log(`\n\nSemantic hybrid search found ${results.count} then limited to top ${searchOptions.top}`);

    for await (const result of results.results) {

        // Log each result
        const doc = result.document;
        const score = result.score;
        const rerankerScoreDisplay = result.rerankerScore;

        console.log(`- Score: ${score}`);
        console.log(`  Re-ranker Score: ${rerankerScoreDisplay}`);
        console.log(`  HotelId: ${doc.HotelId}`);
        console.log(`  HotelName: ${doc.HotelName}`);
        console.log(`  Description: ${doc.Description || 'N/A'}`);
        console.log(`  Category: ${doc.Category || 'N/A'}`);
        console.log('');
    }

} catch (ex) {
    console.error("Semantic hybrid search failed:", ex);
    throw ex;
}
