import { SearchClient, SearchDocumentsResult, VectorQuery, SearchOptions, SearchResult, AzureKeyCredential } from "@azure/search-documents";
import { DefaultAzureCredential } from "@azure/identity";
import { HotelDocument, credential } from "./config.js";

export const searchEndpoint = process.env.AZURE_SEARCH_ENDPOINT!;
export const indexName = process.env.AZURE_SEARCH_INDEX_NAME!;

const searchClient = new SearchClient<HotelDocument>(
    searchEndpoint,
    indexName,
    credential
);

const results = await searchClient.search("walking distance to live music", {
    queryType: "semantic",
    semanticSearchOptions: {
        configurationName: "semantic-config"
    },
    select: ["HotelId", "HotelName", "Description"]
});

for await (const result of results.results) {

    // Log each result
    const doc = result.document;
    const score = result.score;
    const rerankerScoreDisplay = result.rerankerScore;

    console.log(`  Re-ranker Score: ${rerankerScoreDisplay}`);
    console.log(`  HotelId: ${doc.HotelId}`);
    console.log(`  HotelName: ${doc.HotelName}`);
    console.log(`  Description: ${doc.Description || 'N/A'}\n`);
}