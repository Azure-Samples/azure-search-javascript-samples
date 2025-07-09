//import { AzureKeyCredential } from "@azure/search-documents";
//export const credential = new AzureKeyCredential(searchApiKey);

import { DefaultAzureCredential } from "@azure/identity";

// Configuration - use environment variables
export const searchEndpoint = process.env.AZURE_SEARCH_ENDPOINT || "PUT-YOUR-SEARCH-SERVICE-ENDPOINT-HERE";
export const searchApiKey = process.env.AZURE_SEARCH_API_KEY || "PUT-YOUR-SEARCH-SERVICE-ADMIN-API-KEY-HERE";
export const indexName = process.env.AZURE_SEARCH_INDEX_NAME || "hotels-sample-index";

// Create credential
export const credential = new DefaultAzureCredential();

console.log(`Using Azure Search endpoint: ${searchEndpoint}`);
console.log(`Using index name: ${indexName}\n\n`);
