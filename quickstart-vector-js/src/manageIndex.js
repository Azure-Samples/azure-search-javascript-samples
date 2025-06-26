// <Index_dependencies>
import { DefaultAzureCredential } from "@azure/identity";
import {
    SearchIndexClient,
    SearchClient
} from "@azure/search-documents";

import { DOCUMENTS } from "./documents.js";

const credential = new DefaultAzureCredential();
export const searchEndpoint = process.env.AZURE_SEARCH_ENDPOINT;
export const indexName = process.env.AZURE_SEARCH_INDEX_NAME;

console.log(`Using Azure Search endpoint: ${searchEndpoint}`);
console.log(`Using index name: ${indexName}`);
// </Index_dependencies>
// <Index_createIndex>
export async function createIndex() {

    const indexClient = new SearchIndexClient(searchEndpoint, credential);

    console.log('Creating index...');
 
    // Define fields
    const fields = [
        {
            name: "HotelId",
            type: "Edm.String",
            key: true,
            filterable: true
        },
        {
            name: "HotelName",
            type: "Edm.String",
            sortable: true,
            searchable: true,
            hidden: false,
        },
        {
            name: "Description",
            type: "Edm.String",
            searchable: true,
            hidden: false
        },
        {
            name: "DescriptionVector",
            type: "Collection(Edm.Single)",
            searchable: true,
            vectorSearchDimensions: 1536,
            vectorSearchProfileName: "my-vector-profile",
            hidden: true
        },
        {
            name: "Category",
            type: "Edm.String",
            sortable: true,
            filterable: true,
            facetable: true,
            searchable: true,
            hidden: false
        },
        {
            name: "Tags",
            type: "Collection(Edm.String)",
            searchable: true,
            filterable: true,
            facetable: true,
            hidden: false
        },
        {
            name: "ParkingIncluded",
            type: "Edm.Boolean",
            filterable: true,
            sortable: true,
            facetable: true
        },
        {
            name: "LastRenovationDate",
            type: "Edm.DateTimeOffset",
            filterable: true,
            sortable: true,
            facetable: true
        },
        {
            name: "Rating",
            type: "Edm.Double",
            filterable: true,
            sortable: true,
            facetable: true
        },
        {
            name: "Address",
            type: "Edm.ComplexType",
            fields: [
                {
                    name: "StreetAddress",
                    type: "Edm.String",
                    searchable: true,
                },
                {
                    name: "City",
                    type: "Edm.String",
                    filterable: true,
                    sortable: true,
                    facetable: true,
                    hidden: false,
                    searchable: true
                },
                {
                    name: "StateProvince",
                    type: "Edm.String",
                    filterable: true,
                    sortable: true,
                    facetable: true,
                    hidden: false,
                    searchable: true
                },
                {
                    name: "PostalCode",
                    type: "Edm.String",
                    filterable: true,
                    sortable: true,
                    facetable: true,
                    searchable: true
                },
                {
                    name: "Country",
                    type: "Edm.String",
                    filterable: true,
                    sortable: true,
                    facetable: true,
                    searchable: true,
                }
            ]
        },
        {
            name: "Location",
            type: "Edm.GeographyPoint",
            filterable: true,
            sortable: true
        }
    ];

    // Define vector search configuration
    const vectorSearch = {
        algorithms: [
            {
                name: "hnsw-vector-config",
                kind: "hnsw"
            },
            {
                name: "eknn-vector-config",
                kind: "exhaustiveKnn"
            }
        ],
        profiles: [
            {
                name: "my-vector-profile",
                algorithmConfigurationName: "hnsw-vector-config"
            }
        ]
    };

    // Define semantic configuration
    const semanticConfig = {
        name: "semantic-config",
        prioritizedFields: {
            titleField: {
                name: "HotelName"
            },
            contentFields: [
                {
                    name: "Description"
                }
            ],
            keywordsFields: [
                {
                    name: "Category"
                }
            ]
        }
    };

    // Create the semantic settings with the configuration
    const semanticSearch = {
        configurations: [semanticConfig]
    };

    // Define suggesters
    const suggesters = [];

    // Create the search index with the semantic settings
    const indexDefinition = {
        name: indexName,
        fields: fields,
        vectorSearch: vectorSearch,
        semanticSearch: semanticSearch,
        suggesters: suggesters
    };

    const result = await indexClient.createOrUpdateIndex(indexDefinition);
    console.log(`${result.name} created`);

    return indexClient;
}
export async function deleteIndex(searchIndexClient) {


    try {
        console.log("Deleting index...");
        await searchIndexClient.deleteIndex(indexName);
        console.log(`Index ${indexName} deleted`);
    } catch (ex) {
        console.error("Failed to delete index:", ex);
    }
}
// </Index_createIndex>
// <Index_uploadDocuments>
export async function uploadDocuments() {
    const searchClient = new SearchClient(searchEndpoint, indexName, credential);

    if (process.env.INDEX_DATA_LOADED_ === "true") {
        return;
    }

    try {
        console.log("Uploading documents...");
        const result = await searchClient.uploadDocuments(DOCUMENTS);
        for (const r of result.results) {
            console.log(`Key: ${r.key}, Succeeded: ${r.succeeded}, ErrorMessage: ${r.errorMessage || 'none'}`);
        }
        await waitUntilIndexed();
    } catch (ex) {
        console.error("Failed to upload documents:", ex);
    }
}
// </Index_uploadDocuments>
// <Index_waitTillIndexed>
export async function waitUntilIndexed() {
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
// </Index_waitTillIndexed>