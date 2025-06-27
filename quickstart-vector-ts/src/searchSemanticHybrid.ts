import { SearchClient, SearchDocumentsResult, VectorQuery, SearchOptions, SearchResult, AzureKeyCredential } from "@azure/search-documents";
import { vector } from "../quickstart-vector-ts/src/queryVector.js";
import { DefaultAzureCredential } from "@azure/identity";

export const searchEndpoint = process.env.AZURE_SEARCH_ENDPOINT!;
export const indexName = process.env.AZURE_SEARCH_INDEX_NAME!;

console.log(`Using Azure Search endpoint: ${searchEndpoint}`);
console.log(`Using index name: ${indexName}`);

// Define an interface for the hotel document
export interface HotelDocument {
    HotelId: string;
    HotelName: string;
    Description: string;
    DescriptionVector?: number[];
    Category?: string;
    Tags?: string[] | string;
    Address?: {
        City: string;
        StateProvince: string;
    };
    Location?: {
        type: string;
        coordinates: [number, number]; // [longitude, latitude]
    };
    "@search.score"?: number;
    "@search.reranker_score"?: number;
}

// const key = process.env.AZURE_SEARCH_KEY || "";
// const searchClient = new SearchClient<HotelDocument>(
//     searchEndpoint!,
//     indexName,
//     new AzureKeyCredential(key)
// );

const searchClient = new SearchClient<HotelDocument>(
    searchEndpoint,
    indexName,
    new DefaultAzureCredential()
);

try {

    const vectorQuery: VectorQuery<HotelDocument> = {
        vector: vector,
        kNearestNeighborsCount: 5,
        fields: ["DescriptionVector"],
        kind: "vector",
        exhaustive: true

    };

    // Create semantic hybrid search options with vector query and semantic configuration
    const searchOptions: SearchOptions<HotelDocument> = {
        top: 5,
        includeTotalCount: true,
        select: ["HotelId", "HotelName", "Category", "Description"] as const,
        queryType: "semantic" as const,
        semanticSearchOptions: {
            configurationName: "semantic-config"
        },
        vectorSearchOptions: {
            queries: [vectorQuery],
            filterMode: "postFilter" // Apply filter after vector similarity is calculated
        },
    };

    // Use search_text for semantic search
    const searchText = "historic hotel walk to restaurants and shopping";
    const results: SearchDocumentsResult<HotelDocument> = await searchClient.search(searchText, searchOptions);

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