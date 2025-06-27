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

    const searchOptions: SearchOptions<HotelDocument> = {
        top: 5,
        includeTotalCount: true,
        select: [
            "HotelId", "HotelName", "Category", "Description", "Address/City", "Address/StateProvince"
        ] as const,
        facets: ["Address/StateProvince"],
        vectorSearchOptions: {
            queries: [vectorQuery],
            filterMode: "postFilter" // Apply filter after vector similarity is calculated
        },
        filter: "geo.distance(Location, geography'POINT(-77.03241 38.90166)') le 300",
    };
    const results: SearchDocumentsResult<HotelDocument> = await searchClient.search("*", searchOptions);

    console.log(`\n\nVector search with geo filter found ${results.count}`);

    for await (const result of results.results) {

        // Log each result
        const doc = result.document;

        console.log(`- HotelId: ${doc.HotelId}`);
        console.log(`  HotelName: ${doc.HotelName}`);
        console.log(`  Score: ${result.score}`);

        if (doc.Address) {
            console.log(`  City/State: ${doc.Address.City}, ${doc.Address.StateProvince}`);
        }

        console.log(`  Description: ${doc.Description || 'N/A'}`);
        console.log(`  Score: ${result.score}\n`);
    }


} catch (ex) {
    console.error("Vector search with geo filter failed:", ex);
    throw ex;
}