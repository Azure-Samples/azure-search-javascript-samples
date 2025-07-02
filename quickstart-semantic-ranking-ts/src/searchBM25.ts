import { SearchClient } from "@azure/search-documents";
import { searchEndpoint, indexName, credential, HotelDocument } from "./config.js";

const searchClient = new SearchClient<HotelDocument>(searchEndpoint, indexName, credential);

export async function runEmptyQuery(): Promise<void> {
    console.log("\n=== Running empty query to verify index ===");
    
    const results = await searchClient.search("*", {
        select: ["HotelName", "Description"],
        includeTotalCount: true
    });

    console.log(`Total Documents Matching Query: ${results.count}`);
    
    for await (const result of results.results) {
        console.log(`Score: ${result.score}`);
        console.log(`Hotel: ${result.document.HotelName}`);
        console.log(`Description: ${result.document.Description}\n`);
    }
}

export async function runTextQuery(query: string = "restaurant on site"): Promise<void> {
    console.log(`\n=== Running text query (BM25 scoring): "${query}" ===`);
    
    const results = await searchClient.search(query, {
        queryType: "simple",
        select: ["HotelName", "HotelId", "Description"],
        includeTotalCount: true
    });

    console.log("BM25-scored results:");
    for await (const result of results.results) {
        console.log(`Score: ${result.score}`);
        console.log(`Hotel: ${result.document.HotelName}`);
        console.log(`Description: ${result.document.Description}\n`);
    }
}

// Default export for running a simple text search demo
export default async function runBM25Search(): Promise<void> {
    await runEmptyQuery();
    await runTextQuery();
}
