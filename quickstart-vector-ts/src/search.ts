import { DefaultAzureCredential } from "@azure/identity";
import { SearchClient, SearchDocumentsResult, VectorQuery, SearchOptions, SearchResult } from "@azure/search-documents";
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

// Define interfaces for search results
interface SearchResultItem {
    document: HotelDocument;
    score?: number;
    rerankerScore?: number;
}

interface SearchResponse {
    results: SearchResultItem[];
    totalCount: number;
}

export async function singleVectorSearch(vector: number[]): Promise<SearchResponse> {
    if (vector && vector.length > 0) {
        try {
            const searchClient = new SearchClient<HotelDocument>(searchEndpoint!, indexName, credential);

            // Create a vector search options with the vector query
            const searchOptions: SearchOptions<HotelDocument> & { vectorQueries: any[] } = {
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

            const results: SearchDocumentsResult<HotelDocument> = await searchClient.search("*", searchOptions);

            // Convert results to typed format
            const searchResults: SearchResultItem[] = [];
            for await (const result of results.results) {
                searchResults.push({
                    document: result.document,
                    score: result.score
                });
            }

            const response: SearchResponse = {
                results: searchResults,
                totalCount: results.count !== undefined ? results.count : 0
            };

            // Log results for debugging
            console.log(`\n\nSingle Vector search - Total results: ${response.totalCount}`);
            response.results.forEach(result => {
                const doc = result.document;
                console.log(`- HotelId: ${doc.HotelId}, HotelName: ${doc.HotelName}, Category: ${doc.Category || 'N/A'}`);
            });

            return response;
        } catch (ex) {
            console.error("Vector search failed:", ex);
            throw ex;
        }
    } else {
        console.log("No vector loaded, skipping search.");
        return { results: [], totalCount: 0 };
    }
}

export async function singleVectorSearchWithFilter(vector: number[]): Promise<SearchResponse> {
    if (vector && vector.length > 0) {
        try {
            const searchClient = new SearchClient<HotelDocument>(searchEndpoint!, indexName, credential);

            // Create a vector search options with the vector query and filter
            const searchOptions: SearchOptions<HotelDocument> & { vectorQueries: any[] } = {
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

            const results: SearchDocumentsResult<HotelDocument> = await searchClient.search("*", searchOptions);

            // Convert results to typed format
            const searchResults: SearchResultItem[] = [];
            for await (const result of results.results) {
                searchResults.push({
                    document: result.document,
                    score: result.score
                });
            }

            const response: SearchResponse = {
                results: searchResults,
                totalCount: results.count !== undefined ? results.count : 0
            };

            // Log results for debugging
            console.log(`\n\nSingle Vector search with filter - Total results: ${response.totalCount}`);
            response.results.forEach(result => {
                const doc = result.document;
                console.log(`- HotelId: ${doc.HotelId}, HotelName: ${doc.HotelName}, Tags: ${doc.Tags ? JSON.stringify(doc.Tags) : 'N/A'}`);
            });

            return response;
        } catch (ex) {
            console.error("Vector search with filter failed:", ex);
            throw ex;
        }
    } else {
        console.log("No vector loaded, skipping search.");
        return { results: [], totalCount: 0 };
    }
}

export async function vectorQueryWithGeoFilter(vector: number[]): Promise<SearchResponse> {
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

            const searchOptions: SearchOptions<HotelDocument> & { 
                vectorQueries: VectorQuery<HotelDocument>[];
                vectorFilterMode?: string;
            } = {
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

            const results: SearchDocumentsResult<HotelDocument> = await searchClient.search("*", searchOptions);

            // Convert results to typed format
            const searchResults: SearchResultItem[] = [];
            for await (const result of results.results) {
                searchResults.push({
                    document: result.document,
                    score: result.score
                });
            }

            const response: SearchResponse = {
                results: searchResults,
                totalCount: results.count !== undefined ? results.count : 0
            };

            // Log results for debugging
            console.log(`\n\nVector search with geo filter - Total results: ${response.totalCount}`);
            response.results.forEach(result => {
                const doc = result.document;
                const score = result.score !== undefined ? result.score : "N/A";

                console.log(`- HotelId: ${doc.HotelId}`);
                console.log(`  HotelName: ${doc.HotelName}`);
                console.log(`  Score: ${score}`);

                if (doc.Address) {
                    console.log(`  City/State: ${doc.Address.City}, ${doc.Address.StateProvince}`);
                }

                console.log(`  Description: ${doc.Description || 'N/A'}\n`);
            });

            return response;
        } catch (ex) {
            console.error("Vector search with geo filter failed:", ex);
            throw ex;
        }
    } else {
        console.log("No vector loaded, skipping search.");
        return { results: [], totalCount: 0 };
    }
}

export async function hybridSearch(vector: number[]): Promise<SearchResponse> {
    if (vector && vector.length > 0) {
        try {
            const searchClient = new SearchClient<HotelDocument>(searchEndpoint!, indexName, credential);

            // Create hybrid search options with both vector query and search text
            const searchOptions: SearchOptions<HotelDocument> & { vectorQueries: any[] } = {
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
            const results: SearchDocumentsResult<HotelDocument> = await searchClient.search(searchText, searchOptions);

            // Convert results to typed format
            const searchResults: SearchResultItem[] = [];
            for await (const result of results.results) {
                searchResults.push({
                    document: result.document,
                    score: result.score
                });
            }

            const response: SearchResponse = {
                results: searchResults,
                totalCount: results.count !== undefined ? results.count : 0
            };

            // Log results for debugging
            console.log(`\n\nHybrid search - Total results: ${response.totalCount}`);
            response.results.forEach(result => {
                const doc = result.document;
                const score = result.score !== undefined ? result.score : "N/A";

                console.log(`- Score: ${score}`);
                console.log(`  HotelId: ${doc.HotelId}`);
                console.log(`  HotelName: ${doc.HotelName}`);
                console.log(`  Description: ${doc.Description || 'N/A'}`);
                console.log(`  Category: ${doc.Category || 'N/A'}`);
                console.log(`  Tags: ${doc.Tags ? JSON.stringify(doc.Tags) : 'N/A'}\n`);
            });

            return response;
        } catch (ex) {
            console.error("Hybrid search failed:", ex);
            throw ex;
        }
    } else {
        console.log("No vector loaded, skipping search.");
        return { results: [], totalCount: 0 };
    }
}
export async function semanticHybridSearch(vector: number[]): Promise<SearchResponse> {
    if (vector && vector.length > 0) {
        try {
            const searchClient = new SearchClient<HotelDocument>(searchEndpoint!, indexName, credential);

            // Create semantic hybrid search options with vector query and semantic configuration
            const searchOptions: SearchOptions<HotelDocument> & { 
                vectorQueries: any[];
                semanticSearchOptions?: {
                    configurationName: string;
                };
            } = {
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
            const results: SearchDocumentsResult<HotelDocument> = await searchClient.search(searchText, searchOptions);

            // Convert results to typed format with reranker score
            const searchResults: SearchResultItem[] = [];
            for await (const result of results.results) {
                // Access reranker score from the document's special properties
                let rerankerScore: number | undefined;
                const docWithMetadata = result.document as any;
                if (docWithMetadata && docWithMetadata["@search.reranker_score"] !== undefined) {
                    rerankerScore = docWithMetadata["@search.reranker_score"];
                }

                searchResults.push({
                    document: result.document,
                    score: result.score,
                    rerankerScore: rerankerScore
                });
            }

            const response: SearchResponse = {
                results: searchResults,
                totalCount: results.count !== undefined ? results.count : 0
            };

            // Log results for debugging
            console.log(`\n\nSemantic hybrid search - Total results: ${response.totalCount}`);
            response.results.forEach(result => {
                const doc = result.document;
                const score = result.score !== undefined ? result.score : "N/A";
                const rerankerScore = result.rerankerScore !== undefined ? result.rerankerScore : "N/A";

                console.log(`- Score: ${score}`);
                console.log(`  Re-ranker Score: ${rerankerScore}`);
                console.log(`  HotelId: ${doc.HotelId}`);
                console.log(`  HotelName: ${doc.HotelName}`);
                console.log(`  Description: ${doc.Description || 'N/A'}`);
                console.log(`  Category: ${doc.Category || 'N/A'}`);
                console.log('');
            });

            return response;
        } catch (ex) {
            console.error("Semantic hybrid search failed:", ex);
            throw ex;
        }
    } else {
        console.log("No vector loaded, skipping search.");
        return { results: [], totalCount: 0 };
    }
}