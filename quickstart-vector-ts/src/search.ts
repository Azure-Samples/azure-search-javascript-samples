// <Search_dependencies>
import { SearchClient, SearchDocumentsResult, VectorQuery, SearchOptions, SearchResult, AzureKeyCredential } from "@azure/search-documents";
import { vector } from "./queryVector.js";
import { HotelDocument, indexName, searchEndpoint } from "./manageIndex.js";
import { DefaultAzureCredential } from "@azure/identity";

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
// </Search_dependencies>

// <Search_singleVectorSearch>
export async function singleVectorSearch(): Promise<void> {
    try {

        const vectorQuery: VectorQuery<HotelDocument> = {
            vector: vector,
            kNearestNeighborsCount: 5,
            fields: ["DescriptionVector"],
            kind: "vector",
            exhaustive: true
        };

        // Create a vector search options with the vector query
        const searchOptions: SearchOptions<HotelDocument>= {
            top: 5, // Limit to top 5 results
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
            console.log(`- HotelId: ${doc.HotelId}, HotelName: ${doc.HotelName}, Category: ${doc.Category || 'N/A'}, Score ${result.score}`);
        }

    } catch (ex) {
        console.error("Vector search failed:", ex);
        throw ex;
    }
}
// </Search_singleVectorSearch>
// <Search_singleVectorSearchWithFilter>
export async function singleVectorSearchWithFilter(): Promise<void> {
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
            filter: "Tags/any(tag: tag eq 'free wifi')", // Adding filter for "free wifi" tag
            vectorSearchOptions: {
                queries: [vectorQuery],
                filterMode: "postFilter" // Apply filter after vector similarity is calculated
            }
        };
        const results: SearchDocumentsResult<HotelDocument> = await searchClient.search("*", searchOptions);

        console.log(`\n\nSingle Vector search with filter found ${results.count}`);

        for await (const result of results.results) {
            // Log each result
            const doc = result.document;
            console.log(`- HotelId: ${doc.HotelId}, HotelName: ${doc.HotelName}, Tags: ${doc.Tags ? JSON.stringify(doc.Tags) : 'N/A'}, Score ${result.score}`);
        }

    } catch (ex) {
        console.error("Vector search with filter failed:", ex);
        throw ex;
    }
}
// </Search_singleVectorSearchWithFilter>
// <Search_vectorQueryWithGeoFilter>
export async function vectorQueryWithGeoFilter(): Promise<void> {
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
}
// </Search_vectorQueryWithGeoFilter>
// <Search_hybridSearch>
export async function hybridSearch(): Promise<void> {

    try {

        const vectorQuery: VectorQuery<HotelDocument> = {
            vector: vector,
            kNearestNeighborsCount: 5,
            fields: ["DescriptionVector"],
            kind: "vector",
            exhaustive: true

        };

        // Create hybrid search options with both vector query and search text
        const searchOptions: SearchOptions<HotelDocument> = {
            top: 5,
            includeTotalCount: true,
            select: ["HotelId", "HotelName", "Description", "Category", "Tags"] as const,
            vectorSearchOptions: {
                queries: [vectorQuery],
                filterMode: "postFilter" // Apply filter after vector similarity is calculated
            }
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
// </Search_hybridSearch>
// <Search_semanticHybridSearch>
export async function semanticHybridSearch(): Promise<void> {

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
}
// </Search_semanticHybridSearch>