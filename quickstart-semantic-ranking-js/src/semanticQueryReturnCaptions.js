import { SearchClient } from "@azure/search-documents";
import { credential, searchEndpoint, indexName } from "./config.js";

const searchClient = new SearchClient(
    searchEndpoint,
    indexName,
    credential
);

const configurationName = process.env.SEMANTIC_CONFIGURATION_NAME || "semantic-config";

// Debug info
console.log(`Using semantic configuration: ${configurationName}`);
console.log("Search query: walking distance to live music");

const results = await searchClient.search("walking distance to live music", {
    queryType: "semantic",
    semanticSearchOptions: {
        configurationName: configurationName,
        captions: {
            captionType: "extractive",
            highlight: true
        }
    },
    select: ["HotelId", "HotelName", "Description"],
});

console.log(`Found ${results.count} results with semantic search\n`);
let rowNumber = 1;

for await (const result of results.results) {
    // Log each result
    const doc = result.document;
    const rerankerScoreDisplay = result.rerankerScore;

    console.log(`Search result #${rowNumber++}:`);
    console.log(`  Re-ranker Score: ${rerankerScoreDisplay}`);
    console.log(`  HotelName: ${doc.HotelName}`);
    console.log(`  Description: ${doc.Description || 'N/A'}\n`);

    // Caption handling with better debugging
    const captions = result.captions;
    
    if (captions && captions.length > 0) {
        const caption = captions[0];
        
        if (caption.highlights) {
            console.log(`  Caption with highlights: ${caption.highlights}`);
        } else if (caption.text) {
            console.log(`  Caption text: ${caption.text}`);
        } else {
            console.log(`  Caption exists but has no text or highlights content`);
        }
    } else {
        console.log("  No captions found for this result");
    }
    console.log("-".repeat(60));
}
