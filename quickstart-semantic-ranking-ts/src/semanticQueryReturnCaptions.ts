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
        }
    },
    select: ["HotelId", "HotelName", "Description"],
     
});

const semanticAnswers = results.answers;

if( !semanticAnswers || semanticAnswers.length === 0) {
    console.log("No semantic answers found.");
    process.exit(0);
}

for (const answer of semanticAnswers) {
    console.log(`Answer: ${answer.text}`);
    if (answer.captions) {
        for (const caption of answer.captions) {
            console.log(`Caption: ${caption.text}`);
        }
    }
}

for await (const result of results.results) {

    // Log each result
    const doc = result.document;
    const rerankerScoreDisplay = result.rerankerScore;

    console.log(`  Re-ranker Score: ${rerankerScoreDisplay}`);
    console.log(`  HotelName: ${doc.HotelName}`);
    console.log(`  Description: ${doc.Description || 'N/A'}\n`);

    const captions = result.captions;
    if (captions && captions.length > 0 ) {

        if( captions[0].highlights) {
            console.log(`Caption: ${captions[0].text || "No caption text"}`);
        } else {
            console.log(`Caption: ${captions[0].text || "No caption text"}`);
        }
    
    } else {
        console.log("No captions found");
    }
}