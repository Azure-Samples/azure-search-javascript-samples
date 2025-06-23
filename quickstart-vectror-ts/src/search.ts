import { DefaultAzureCredential } from "@azure/identity";
import { SearchClient, SearchDocumentsResult, VectorQuery } from "@azure/search-documents";
import * as dotenv from "dotenv";

// Load environment variables from .env file
dotenv.config();

const searchEndpoint = process.env.AZURE_SEARCH_ENDPOINT;
const indexName = process.env.AZURE_SEARCH_INDEX || "vector-search-quickstart";
const credential = new DefaultAzureCredential();

// Define an interface for the hotel document
interface HotelDocument {
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

export async function singleVectorSearch(vector: number[]): Promise<void> {
    if (vector && vector.length > 0) {
        try {
            const searchClient = new SearchClient<HotelDocument>(searchEndpoint!, indexName, credential);

            // Create a vector search options with the vector query
            const searchOptions = {
                vectorQueries: [
                    {
                        vector: vector,
                        kNearestNeighbors: 5,
                        fields: ["DescriptionVector"],
                        exhaustive: true
                    }
                ],
                select: ["HotelId", "HotelName", "Description", "Category", "Tags"] as const,
                top: 5,
                includeTotalCount: true
            };

            const results = await searchClient.search("*", searchOptions);

            // Iterate through results
            console.log(`\nSingle Vector search - Total results: ${results.count !== undefined ? results.count : 0}`);
            for await (const result of results.results) {
                const doc = result.document;
                console.log(`- HotelId: ${doc.HotelId}, HotelName: ${doc.HotelName}, Category: ${doc.Category || 'N/A'}`);
            }
        } catch (ex) {
            console.error("Vector search failed:", ex);
        }
    } else {
        console.log("No vector loaded, skipping search.");
    }
}

export async function singleVectorSearchWithFilter(vector: number[]): Promise<void> {
    if (vector && vector.length > 0) {
        try {
            const searchClient = new SearchClient<HotelDocument>(searchEndpoint!, indexName, credential);

            // Create a vector search options with the vector query and filter
            const searchOptions = {
                vectorQueries: [
                    {
                        vector: vector,
                        kNearestNeighbors: 5,
                        fields: ["DescriptionVector"],
                        exhaustive: true
                    }
                ],
                filter: "Tags/any(tag: tag eq 'free wifi')", // Adding filter for "free wifi" tag
                select: ["HotelId", "HotelName", "Description", "Category", "Tags"] as const,
                top: 7, // Increased to 7 as in the Python example
                includeTotalCount: true
            };

            const results = await searchClient.search("*", searchOptions);            // Get the count - using count property instead of getCount() method
            const count = results.count;
            console.log(`Total filtered results: ${count !== undefined ? count : 0}`);

            // Iterate through results
            console.log(`\nSingle Vector search with filter - Total results: ${results.count !== undefined ? results.count : 0}`);
            for await (const result of results.results) {
                const doc = result.document;
                console.log(`- HotelId: ${doc.HotelId}, HotelName: ${doc.HotelName}, Tags: ${doc.Tags ? JSON.stringify(doc.Tags) : 'N/A'}`);
            }
        } catch (ex) {
            console.error("Vector search with filter failed:", ex);
        }
    } else {
        console.log("No vector loaded, skipping search.");
    }
}

export async function vectorQueryWithGeoFilter(vector: number[]): Promise<void> {
    if (vector && vector.length > 0) {
        try {
            const searchClient = new SearchClient<HotelDocument>(searchEndpoint!, indexName, credential);

            const vectorQueries: VectorQuery<HotelDocument>[] = [{
                vector: vector,
                kNearestNeighborsCount: 5,
                fields: ["DescriptionVector"],
                exhaustive: true,
                kind: "vector"
            }];

            const searchOptions = {
                vectorQueries: vectorQueries,
                includeTotalCount: true,
                top: 5,
                select: [
                    "HotelId", "HotelName", "Category", "Description", "Address/City", "Address/StateProvince"
                ] as const,
                facets: ["Address/StateProvince"],
                filter: "geo.distance(Location, geography'POINT(-77.03241 38.90166)') le 300", // Filter hotels within 300 km of Washington DC
                vectorFilterMode: "postFilter" // Apply filter after vector similarity is calculated
            };

            const results = await searchClient.search("*", searchOptions);

            // Get the count
            const count = results.count;

            console.log(`\nVector search with geo filter - Total results: ${results.count !== undefined ? results.count : 0}`);

            // Iterate through results
            for await (const result of results.results) {
                const doc = result.document;
                // Access score from the result object which includes @search.score
                const score = result.score !== undefined ? result.score : "N/A";

                console.log(`- HotelId: ${doc.HotelId}`);
                console.log(`  HotelName: ${doc.HotelName}`);
                console.log(`  Score: ${score}`);

                if (doc.Address) {
                    console.log(`  City/State: ${doc.Address.City}, ${doc.Address.StateProvince}`);
                }

                console.log(`  Description: ${doc.Description || 'N/A'}\n`);
            }
        } catch (ex) {
            console.error("Vector search with geo filter failed:", ex);
        }
    } else {
        console.log("No vector loaded, skipping search.");
    }
}

export async function hybridSearch(vector: number[]): Promise<void> {
    if (vector && vector.length > 0) {
        try {
            const searchClient = new SearchClient<HotelDocument>(searchEndpoint!, indexName, credential);

            // Create hybrid search options with both vector query and search text
            const searchOptions = {
                vectorQueries: [
                    {
                        vector: vector,
                        kNearestNeighbors: 5,
                        fields: ["DescriptionVector"],
                        exhaustive: true,
                    }
                ],
                includeTotalCount: true,
                select: ["HotelId", "HotelName", "Description", "Category", "Tags"] as const,
                top: 5
            };

            // Use search_text for keyword search (hybrid search = vector + keyword)
            const searchText = "historic hotel walk to restaurants and shopping";
            const results = await searchClient.search(searchText, searchOptions);

            // Get the count
            const count = results.count;

            console.log(`\nHybrid search - Total results: ${results.count !== undefined ? results.count : 0}`);

            // Iterate through results
            for await (const result of results.results) {
                const doc = result.document;
                const score = result.score !== undefined ? result.score : "N/A";

                console.log(`- Score: ${score}`);
                console.log(`  HotelId: ${doc.HotelId}`);
                console.log(`  HotelName: ${doc.HotelName}`);
                console.log(`  Description: ${doc.Description || 'N/A'}`);
                console.log(`  Category: ${doc.Category || 'N/A'}`);
                console.log(`  Tags: ${doc.Tags ? JSON.stringify(doc.Tags) : 'N/A'}\n`);
            }
        } catch (ex) {
            console.error("Hybrid search failed:", ex);
        }
    } else {
        console.log("No vector loaded, skipping search.");
    }
}
export async function semanticHybridSearch(vector: number[]): Promise<void> {
    if (vector && vector.length > 0) {
        try {
            const searchClient = new SearchClient<HotelDocument>(searchEndpoint!, indexName, credential);
            // Create semantic hybrid search options with vector query and semantic configuration
            const searchOptions = {
                vectorQueries: [
                    {
                        vector: vector,
                        kNearestNeighbors: 5,
                        fields: ["DescriptionVector"],
                        exhaustive: true
                    }
                ],
                includeTotalCount: true,
                select: ["HotelId", "HotelName", "Category", "Description"] as const,
                queryType: "semantic" as const,
                semanticSearchOptions: {
                    configurationName: "my-semantic-config"
                },
                top: 5
            };

            // Use search_text for semantic search
            const searchText = "historic hotel walk to restaurants and shopping";
            const results = await searchClient.search(searchText, searchOptions);

            // Get the count
            const count = results.count;
            console.log(`\nSemantic hybrid search with a filter - Total results: ${results.count !== undefined ? results.count : 0}`);

            // Iterate through results
            for await (const result of results.results) {
                const doc = result.document;
                const score = result.score !== undefined ? result.score : "N/A";
                // Access reranker score from the document's special properties
                let rerankerScore = "N/A";
                // In TypeScript SDK, the reranker score is typically in captions or document metadata
                // Using any here to access potential dynamically added properties
                const docWithMetadata = doc as any;
                if (docWithMetadata && docWithMetadata["@search.reranker_score"] !== undefined) {
                    rerankerScore = docWithMetadata["@search.reranker_score"];
                }

                console.log(`- Score: ${score}`);
                console.log(`  Re-ranker Score: ${rerankerScore}`);
                console.log(`  HotelId: ${doc.HotelId}`);
                console.log(`  HotelName: ${doc.HotelName}`);
                console.log(`  Description: ${doc.Description || 'N/A'}`);
                console.log(`  Category: ${doc.Category || 'N/A'}`);
                console.log('');
            }
        } catch (ex) {
            console.error("Semantic hybrid search failed:", ex);
        }
    } else {
        console.log("No vector loaded, skipping search.");
    }
}