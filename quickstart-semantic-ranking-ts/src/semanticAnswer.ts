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
        configurationName: "semantic-config",
        captions: {
            captionType: "extractive"
        },
        answers: {
            answerType: "extractive"
        }
    },
    select: ["HotelName", "Description", "Category"]
});

console.log(`Answers:\n\n`);

// Extract semantic answers from the search results
const semanticAnswers = results.answers;
for (const answer of semanticAnswers || []) {
    if (answer.highlights) {
        console.log(`Semantic Answer: ${answer.highlights}`);
    } else {
        console.log(`Semantic Answer: ${answer.text}`);
    }
    console.log(`Semantic Answer Score: ${answer.score}\n\n`);
}

console.log(`Search Results:\n\n`);

// Iterate through the search results
for await (const result of results.results) {


    // Log each result
    const doc = result.document;
    const rerankerScoreDisplay = result.rerankerScore;

    console.log(`${rerankerScoreDisplay}`);
    console.log(`${doc.HotelName}`);
    console.log(`${doc.Description || 'N/A'}`);

    const captions = result.captions;

    if (captions && captions.length > 0) {
        const caption = captions[0];
        if (caption.highlights) {
            console.log(`Caption: ${caption.highlights}\n`);
        } else {
            console.log(`Caption: ${caption.text}\n`);
        }
    }
}