import { SearchClient } from "@azure/search-documents";
import { searchEndpoint, indexName, credential, HotelDocument } from "./config.js";

const searchClient = new SearchClient<HotelDocument>(searchEndpoint, indexName, credential);

export async function runSemanticQuery(query: string = "restaurant on site"): Promise<void> {
    console.log(`\n=== Running semantic query: "${query}" ===`);
    
    const results = await searchClient.search(query, {
        queryType: "semantic",
        semanticSearchOptions: {
            configurationName: "semantic-config",
            captions: { captionType: "extractive" }
        },
        select: ["HotelName", "Description", "Category"]
    });

    console.log("Semantic-ranked results:");
    for await (const result of results.results) {
        console.log(`Reranker Score: ${result.rerankerScore}`);
        console.log(`Hotel: ${result.document.HotelName}`);
        console.log(`Description: ${result.document.Description}`);
        
        // Display captions if available
        if (result.captions && result.captions.length > 0) {
            const caption = result.captions[0];
            if (caption.highlights) {
                console.log(`Caption: ${caption.highlights}`);
            } else {
                console.log(`Caption: ${caption.text}`);
            }
        }
        console.log("");
    }
}

// Default export for running a semantic search demo
export default async function runSemanticSearch(): Promise<void> {
    await runSemanticQuery();
}
