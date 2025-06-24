import { DefaultAzureCredential } from "@azure/identity";
import {
    SearchIndexClient,
    SearchIndex,
    SearchClient,
    SearchField,
    VectorSearch,
    SemanticSearch,
    SearchSuggester
} from "@azure/search-documents";
import { DOCUMENTS } from "./documents.js";
import { QUERY_VECTOR } from "./queryVector.js";
import * as MyVectorSearch from './search.js';

const searchEndpoint = process.env.AZURE_SEARCH_ENDPOINT!;
const credential = new DefaultAzureCredential();
const indexName = "vector-search-quickstart";

async function createIndex(): Promise<SearchIndexClient> {

    const indexClient = new SearchIndexClient(searchEndpoint, credential);

    console.log('Creating index...');

    const indexName = "vector-search-quickstart";
 
    // Define fields
    const indexDefinition: SearchIndex = {
        name: indexName,
        fields: [
            {
                name: "HotelId",
                type: "Edm.String",
                key: true,
                filterable: true
            },
            {
                name: "HotelName",
                type: "Edm.String",
                searchable: true,
                sortable: true
            },
            {
                name: "Description",
                type: "Edm.String",
                searchable: true
            },
            {
                name: "DescriptionVector",
                type: "Collection(Edm.Single)",
                searchable: true,
                vectorSearchDimensions: 1536,
                vectorSearchProfileName: "my-vector-profile"
            },
            {
                name: "Category",
                type: "Edm.String",
                searchable: true,
                sortable: true,
                filterable: true,
                facetable: true
            },
            {
                name: "Tags",
                type: "Collection(Edm.String)",
                searchable: true,
                filterable: true,
                facetable: true
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
                        searchable: true
                    },
                    {
                        name: "City",
                        type: "Edm.String",
                        searchable: true,
                        filterable: true,
                        sortable: true,
                        facetable: true
                    },
                    {
                        name: "StateProvince",
                        type: "Edm.String",
                        searchable: true,
                        filterable: true,
                        sortable: true,
                        facetable: true
                    },
                    {
                        name: "PostalCode",
                        type: "Edm.String",
                        searchable: true,
                        filterable: true,
                        sortable: true,
                        facetable: true
                    },
                    {
                        name: "Country",
                        type: "Edm.String",
                        searchable: true,
                        filterable: true,
                        sortable: true,
                        facetable: true
                    }
                ]
            },
            {
                name: "Location",
                type: "Edm.GeographyPoint",
                filterable: true,
                sortable: true
            }
        ],
        vectorSearch: {
            algorithms: [
                {
                    name: "my-hnsw-vector-config-1",
                    kind: "hnsw"
                },
                {
                    name: "my-eknn-vector-config",
                    kind: "exhaustiveKnn"
                }
            ],
            profiles: [
                {
                    name: "my-vector-profile",
                    algorithmConfigurationName: "my-hnsw-vector-config-1"
                }
            ]
        },
        semanticSearch: {
            configurations: [
                {
                    name: "my-semantic-config",
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
                }
            ]
        },
        suggesters: [
            {
                name: "sg",
                sourceFields: ["Tags", "Address/City", "Address/Country"],
                searchMode: "analyzingInfixMatching"
            }
        ]
    };

    const result = await indexClient.createOrUpdateIndex(indexDefinition);
    console.log(`${result.name} created`);

    return indexClient;
}
async function deleteIndex(searchIndexClient: SearchIndexClient): Promise<void> {


    try {
        console.log("Deleting index...");
        await searchIndexClient.deleteIndex(indexName);
        console.log(`Index ${indexName} deleted`);
    } catch (ex) {
        console.error("Failed to delete index:", ex);
    }
}
async function uploadDocuments(): Promise<void> {
    const searchClient = new SearchClient(searchEndpoint, indexName, credential);

    try {
        console.log("Uploading documents...");
        const result = await searchClient.uploadDocuments(DOCUMENTS);
        for (const r of result.results) {
            console.log(`Key: ${r.key}, Succeeded: ${r.succeeded}, ErrorMessage: ${r.errorMessage || 'none'}`);
        }
    } catch (ex) {
        console.error("Failed to upload documents:", ex);
    }
}

async function main(): Promise<void> {
    try {
        const searchIndexClient = await createIndex();
        await uploadDocuments();

        await MyVectorSearch.singleVectorSearch(QUERY_VECTOR);
        await MyVectorSearch.singleVectorSearchWithFilter(QUERY_VECTOR);
        await MyVectorSearch.vectorQueryWithGeoFilter(QUERY_VECTOR);
        await MyVectorSearch.hybridSearch(QUERY_VECTOR);
        await MyVectorSearch.semanticHybridSearch(QUERY_VECTOR);

        await deleteIndex(searchIndexClient);
    } catch (error) {
        console.error("Error:", error);
    }
}

// Run the main function if this file is executed directly
if (require.main === module) {
    main().catch(console.error);
}

// Export the functions for use in other modules
export { createIndex, uploadDocuments };