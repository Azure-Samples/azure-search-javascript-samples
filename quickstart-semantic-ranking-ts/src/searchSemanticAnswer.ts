import { SearchClient } from "@azure/search-documents";
import { searchEndpoint, indexName, credential, HotelDocument } from "./config.js";

const searchClient = new SearchClient<HotelDocument>(searchEndpoint, indexName, credential);

export async function runSemanticAnswerQuery(query: string = "what hotel is in a historic building"): Promise<void> {
    console.log(`\n=== Running semantic query with answers: "${query}" ===`);
    
    const results = await searchClient.search(query, {
        queryType: "semantic",
        semanticSearchOptions: {
            configurationName: "semantic-config",
            captions: { captionType: "extractive" },
            answers: { answerType: "extractive" }
        },
        select: ["HotelName", "Description", "Category"]
    });

    // Display semantic answers
    if (results.answers && results.answers.length > 0) {
        console.log("Semantic Answers:");
        for (const answer of results.answers) {
            if (answer.highlights) {
                console.log(`Answer: ${answer.highlights}`);
            } else {
                console.log(`Answer: ${answer.text}`);
            }
            console.log(`Answer Score: ${answer.score}\n`);
        }
    } else {
        console.log("No semantic answers found for this query.\n");
    }

    // Display results
    console.log("Search Results:");
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

// Default export for running a semantic answers search demo
export default async function runSemanticAnswerSearch(): Promise<void> {
    await runSemanticAnswerQuery();
}
