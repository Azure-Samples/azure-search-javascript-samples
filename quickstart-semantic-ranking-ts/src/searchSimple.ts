import { SearchClient } from "@azure/search-documents";
import { searchEndpoint, indexName, credential, HotelDocument } from "./config.js";

const searchClient = new SearchClient<HotelDocument>(searchEndpoint, indexName, credential);


const results = await searchClient.search("restaurant on site", {
    queryType: "semantic",
    semanticSearchOptions: {
        configurationName: "semantic-config",
        captions: { captionType: "extractive" }
    },
    select: ["HotelName", "Description", "Category"]
});


for await (const result of results.results) {

    // Log each result
    const doc = result.document;

    console.log(`- Score: ${result.score}`);
    console.log(`  HotelName: ${doc.HotelName}`);
    console.log(`  Description: ${doc.Description || 'N/A'}`);
    console.log(`  Category: ${doc.Category || 'N/A'}`);
}

