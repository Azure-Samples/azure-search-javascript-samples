import { SearchClient, SearchDocumentsResult, VectorQuery, SearchOptions, SearchResult, AzureKeyCredential } from "@azure/search-documents";
import { vector } from "./queryVector.js";
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

    // Create a vector search options with the vector query and filter
    const searchOptions: SearchOptions<HotelDocument> = {
        top: 7,
        select: ["HotelId", "HotelName", "Description", "Category", "Tags"] as const,
        includeTotalCount: true,
        vectorSearchOptions: {
            queries: [vectorQuery],
            filterMode: "postFilter" // Apply filter after vector similarity is calculated
        }
    };
    const results: SearchDocumentsResult<HotelDocument> = await searchClient.search("*", searchOptions);

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
