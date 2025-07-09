import { SearchClient } from "@azure/search-documents";
import { credential, searchEndpoint, indexName } from "./config.js";

const searchClient = new SearchClient(
    searchEndpoint,
    indexName,
    credential
);

const configurationName = process.env.SEMANTIC_CONFIGURATION_NAME || "semantic-config";

const results = await searchClient.search("walking distance to live music", {
    queryType: "semantic",
    semanticSearchOptions: {
        configurationName: configurationName,
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
let rowNumber = 1; 

// Extract semantic answers from the search results
const semanticAnswers = results.answers;
for (const answer of semanticAnswers || []) {
    console.log(`Semantic answer result #${rowNumber++}:`);
    if (answer.highlights) {
        console.log(`Semantic Answer: ${answer.highlights}`);
    } else {
        console.log(`Semantic Answer: ${answer.text}`);
    }
    console.log(`Semantic Answer Score: ${answer.score}\n\n`);
}

console.log(`Search Results:\n\n`);
rowNumber = 1;

// Iterate through the search results
for await (const result of results.results) {
    // Log each result
    const doc = result.document;
    const rerankerScoreDisplay = result.rerankerScore;

    console.log(`Search result #${rowNumber++}:`);
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
