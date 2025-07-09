//import { AzureKeyCredential } from "@azure/search-documents";
//export const credential = new AzureKeyCredential(searchApiKey);

import { DefaultAzureCredential } from "@azure/identity";

// Configuration - use environment variables
export const searchEndpoint: string = process.env.AZURE_SEARCH_ENDPOINT || "PUT-YOUR-SEARCH-SERVICE-ENDPOINT-HERE";
export const searchApiKey: string = process.env.AZURE_SEARCH_API_KEY || "PUT-YOUR-SEARCH-SERVICE-ADMIN-API-KEY-HERE";
export const indexName = process.env.AZURE_SEARCH_INDEX_NAME || "hotels-sample-index";

// Create credential

export const credential = new DefaultAzureCredential();

console.log(`Using Azure Search endpoint: ${searchEndpoint}`);
console.log(`Using index name: ${indexName}\n\n`);

// Hotel document interface
export interface HotelDocument {
    "@search.action"?: string;
    HotelId: string;
    HotelName: string;
    Description: string;
    Category: string;
    Tags: string[];
    ParkingIncluded: string;
    LastRenovationDate: string;
    Rating: number;
    Address: {
        StreetAddress: string;
        City: string;
        StateProvince: string;
        PostalCode: string;
        Country: string;
    };
}
