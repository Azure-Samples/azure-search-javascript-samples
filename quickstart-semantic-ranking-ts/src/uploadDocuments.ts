import { SearchClient } from "@azure/search-documents";
import { searchEndpoint, indexName, credential, HotelDocument } from "./config.js";

const searchClient = new SearchClient<HotelDocument>(searchEndpoint, indexName, credential);

console.log('Uploading documents to semantic search index...');

const DOCUMENTS: HotelDocument[] = [
    {
        "@search.action": "upload",
        "HotelId": "1",
        "HotelName": "Stay-Kay City Hotel",
        "Description": "This classic hotel is fully-refurbished and ideally located on the main commercial artery of the city in the heart of New York. A few minutes away is Times Square and the historic centre of the city, as well as other places of interest that make New York one of America's most attractive and cosmopolitan cities.",
        "Category": "Boutique",
        "Tags": ["view", "air conditioning", "concierge"],
        "ParkingIncluded": "false",
        "LastRenovationDate": "2022-01-18T00:00:00Z",
        "Rating": 3.60,
        "Address": {
            "StreetAddress": "677 5th Ave",
            "City": "New York",
            "StateProvince": "NY",
            "PostalCode": "10022",
            "Country": "USA"
        }
    },
    {
        "@search.action": "upload",
        "HotelId": "2",
        "HotelName": "Old Century Hotel",
        "Description": "The hotel is situated in a nineteenth century plaza, which has been expanded and renovated to the highest architectural standards to create a modern, functional and first-class hotel in which art and unique historical elements coexist with the most modern comforts. The hotel also regularly hosts events like wine tastings, beer dinners, and live music.",
        "Category": "Boutique",
        "Tags": ["pool", "free wifi", "concierge"],
        "ParkingIncluded": "false",
        "LastRenovationDate": "2019-02-18T00:00:00Z",
        "Rating": 3.60,
        "Address": {
            "StreetAddress": "140 University Town Center Dr",
            "City": "Sarasota",
            "StateProvince": "FL",
            "PostalCode": "34243",
            "Country": "USA"
        }
    },
    {
        "@search.action": "upload",
        "HotelId": "3",
        "HotelName": "Gastronomic Landscape Hotel",
        "Description": "The Gastronomic Hotel stands out for its culinary excellence under the management of William Dough, who advises on and oversees all of the Hotel's restaurant services.",
        "Category": "Suite",
        "Tags": ["restaurant", "bar", "continental breakfast"],
        "ParkingIncluded": "true",
        "LastRenovationDate": "2015-09-20T00:00:00Z",
        "Rating": 4.80,
        "Address": {
            "StreetAddress": "3393 Peachtree Rd",
            "City": "Atlanta",
            "StateProvince": "GA",
            "PostalCode": "30326",
            "Country": "USA"
        }
    },
    {
        "@search.action": "upload",
        "HotelId": "4",
        "HotelName": "Sublime Palace Hotel",
        "Description": "Sublime Palace Hotel is located in the heart of the historic center of Sublime in an extremely vibrant and lively area within short walking distance to the sites and landmarks of the city and is surrounded by the extraordinary beauty of churches, buildings, shops and monuments. Sublime Cliff is part of a lovingly restored 19th century resort, updated for every modern convenience.",
        "Category": "Boutique",
        "Tags": ["concierge", "view", "air conditioning"],
        "ParkingIncluded": "true",
        "LastRenovationDate": "2020-02-06T00:00:00Z",
        "Rating": 4.60,
        "Address": {
            "StreetAddress": "7400 San Pedro Ave",
            "City": "San Antonio",
            "StateProvince": "TX",
            "PostalCode": "78216",
            "Country": "USA"
        }
    }
];
async function waitUntilIndexed(): Promise<void> {
    try {
        const searchClient = new SearchClient(searchEndpoint, indexName, credential);
        do {
            const count = await searchClient.getDocumentsCount();
            if (count == DOCUMENTS.length) {
                console.log("All documents indexed successfully.");
                break;
            }
            console.log(`Waiting for indexing... Current count: ${count}`);
            await new Promise((resolve) => setTimeout(resolve, 10000)); // Wait for 10 seconds
        } while (true);
    } catch (ex) {
        console.error("Failed to wait until indexed:", ex);
    }
}
try {
    console.log("Uploading documents...");
    const result = await searchClient.uploadDocuments(DOCUMENTS);
    for (const r of result.results) {
        console.log(`Key: ${r.key}, Succeeded: ${r.succeeded}, ErrorMessage: ${r.errorMessage || 'none'}`);
    }
    await waitUntilIndexed();
} catch (error) {
    console.error("Error uploading documents:", error);
    throw error;
}
