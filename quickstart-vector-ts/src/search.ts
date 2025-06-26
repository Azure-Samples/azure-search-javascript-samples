import { DefaultAzureCredential } from "@azure/identity";
import { SearchClient, SearchDocumentsResult, VectorQuery, SearchOptions, SearchResult } from "@azure/search-documents";
import { vector } from "./queryVector.js";
import { HotelDocument, indexName, searchEndpoint } from "./manageIndex.js"; // Assuming you have a HotelDocument interface defined in documents.js

const credential = new DefaultAzureCredential();

export async function singleVectorSearch(): Promise<void> {
    try {
        const searchClient = new SearchClient<HotelDocument>(searchEndpoint!, indexName, credential);

        const vectorQuery: VectorQuery<HotelDocument> = {
            vector: vector,
            kNearestNeighborsCount: 5,
            fields: ["DescriptionVector"],
            kind: "vector",
            exhaustive: true
        };

        // Create a vector search options with the vector query
        const searchOptions: SearchOptions<HotelDocument> & { vectorQueries: any[] } = {
            vectorQueries: [vectorQuery],
            select: ["HotelId", "HotelName", "Description", "Category", "Tags"] as const,
            includeTotalCount: true
        };
        const results: SearchDocumentsResult<HotelDocument> = await searchClient.search("*", searchOptions);

        // Convert results to typed format and log for debugging
        console.log(`\n\nSingle Vector search found ${results.count}`);

        for await (const result of results.results) {

            // Log each result
            const doc = result.document;
            console.log(`- HotelId: ${doc.HotelId}, HotelName: ${doc.HotelName}, Category: ${doc.Category || 'N/A'}, Score: ${result.score || 'N/A'}`);
        }


    } catch (ex) {
        console.error("Vector search failed:", ex);
        throw ex;
    }
}

export async function singleVectorSearchWithFilter(): Promise<void> {
    try {
        const searchClient = new SearchClient<HotelDocument>(searchEndpoint!, indexName, credential);

        const vectorQuery: VectorQuery<HotelDocument> = {
            vector: vector,
            kNearestNeighborsCount: 5,
            fields: ["DescriptionVector"],
            kind: "vector",
            exhaustive: true
        };

        // Create a vector search options with the vector query and filter
        const searchOptions: SearchOptions<HotelDocument> & { vectorQueries: any[] } = {
            vectorQueries: [vectorQuery],
            filter: "Tags/any(tag: tag eq 'free wifi')", // Adding filter for "free wifi" tag
            select: ["HotelId", "HotelName", "Description", "Category", "Tags"] as const,
            includeTotalCount: true
        };
        const results: SearchDocumentsResult<HotelDocument> = await searchClient.search("*", searchOptions);

        console.log(`\n\nSingle Vector search with filter found ${results.count} then limited to top ${searchOptions.top}`);

        for await (const result of results.results) {

            // Log each result
            const doc = result.document;
            console.log(`- HotelId: ${doc.HotelId}, HotelName: ${doc.HotelName}, Tags: ${doc.Tags ? JSON.stringify(doc.Tags) : 'N/A'}`);
        }

    } catch (ex) {
        console.error("Vector search with filter failed:", ex);
        throw ex;
    }
}

export async function vectorQueryWithGeoFilter(): Promise<void> {

    try {
        const searchClient = new SearchClient<HotelDocument>(searchEndpoint!, indexName, credential);

        const vectorQuery: VectorQuery<HotelDocument> = {
            vector: vector,
            kNearestNeighborsCount: 5,
            fields: ["DescriptionVector"],
            kind: "vector",
            exhaustive: true

        };

        const searchOptions: SearchOptions<HotelDocument> & {
            vectorQueries: VectorQuery<HotelDocument>[];
            vectorFilterMode?: string;
        } = {
            vectorQueries: [vectorQuery],
            includeTotalCount: true,
            select: [
                "HotelId", "HotelName", "Category", "Description", "Address/City", "Address/StateProvince"
            ] as const,
            facets: ["Address/StateProvince"],
            filter: "geo.distance(Location, geography'POINT(-77.03241 38.90166)') le 300", // Filter hotels within 300 km of Washington DC
            vectorFilterMode: "postFilter" // Apply filter after vector similarity is calculated
        };
        const results: SearchDocumentsResult<HotelDocument> = await searchClient.search("*", searchOptions);

        console.log(`\n\nVector search with geo filter found ${results.count} then limited to top ${searchOptions.top}`);

        for await (const result of results.results) {

            // Log each result
            const doc = result.document;

            console.log(`- HotelId: ${doc.HotelId}`);
            console.log(`  HotelName: ${doc.HotelName}`);
            console.log(`  Score: ${result.score}`);

            if (doc.Address) {
                console.log(`  City/State: ${doc.Address.City}, ${doc.Address.StateProvince}`);
            }

            console.log(`  Description: ${doc.Description || 'N/A'}\n`);
        }


    } catch (ex) {
        console.error("Vector search with geo filter failed:", ex);
        throw ex;
    }
}


export async function hybridSearch(): Promise<void> {

    try {
        const searchClient = new SearchClient<HotelDocument>(searchEndpoint!, indexName, credential);

        const vectorQuery: VectorQuery<HotelDocument> = {
            vector: vector,
            kNearestNeighborsCount: 5,
            fields: ["DescriptionVector"],
            kind: "vector",
            exhaustive: true

        };

        // Create hybrid search options with both vector query and search text
        const searchOptions: SearchOptions<HotelDocument> & { vectorQueries: any[] } = {
            vectorQueries: [vectorQuery],
            includeTotalCount: true,
            select: ["HotelId", "HotelName", "Description", "Category", "Tags"] as const
        };

        // Use search_text for keyword search (hybrid search = vector + keyword)
        const searchText = "historic hotel walk to restaurants and shopping";
        const results: SearchDocumentsResult<HotelDocument> = await searchClient.search(searchText, searchOptions);            // Convert results to typed format and log for debugging

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

}
export async function semanticHybridSearch(): Promise<void> {

    try {
        const searchClient = new SearchClient<HotelDocument>(searchEndpoint!, indexName, credential);

        const vectorQuery: VectorQuery<HotelDocument> = {
            vector: vector,
            kNearestNeighborsCount: 5,
            fields: ["DescriptionVector"],
            kind: "vector",
            exhaustive: true

        };

        // Create semantic hybrid search options with vector query and semantic configuration
        const searchOptions: SearchOptions<HotelDocument> & {
            vectorQueries: any[];
            semanticSearchOptions?: {
                configurationName: string;
            };
        } = {
            vectorQueries: [vectorQuery],
            includeTotalCount: true,
            select: ["HotelId", "HotelName", "Category", "Description"] as const,
            queryType: "semantic" as const,
            semanticSearchOptions: {
                configurationName: "semantic-config"
            }
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
}