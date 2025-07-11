import { SearchClient } from "@azure/search-documents";
import { HotelDocument, credential, searchEndpoint, indexName, semanticConfigurationName } from "./config.js";

const searchClient = new SearchClient<HotelDocument>(
    searchEndpoint,
    indexName,
    credential
);

const results = await searchClient.search("walking distance to live music", {
    queryType: "semantic",
    semanticSearchOptions: {
        configurationName: semanticConfigurationName
    },
    select: ["HotelId", "HotelName", "Description"]
});

let rowNumber = 1;
for await (const result of results.results) {

    // Log each result
    const doc = result.document;
    const score = result.score;
    const rerankerScoreDisplay = result.rerankerScore;

    console.log(`Search result #${rowNumber++}:`);
    console.log(`  Re-ranker Score: ${rerankerScoreDisplay}`);
    console.log(`  HotelId: ${doc.HotelId}`);
    console.log(`  HotelName: ${doc.HotelName}`);
    console.log(`  Description: ${doc.Description || 'N/A'}\n`);
}