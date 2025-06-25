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
    const fields: SearchField[] = [
        {
            name: "HotelId",
            type: "Edm.String" as const,
            key: true,
            filterable: true
        },
        {
            name: "HotelName",
            type: "Edm.String" as const,
            sortable: true,
            searchable: true,
            hidden: false,
        },
        {
            name: "Description",
            type: "Edm.String" as const,
            searchable: true,
            hidden: false
        },
        {
            name: "DescriptionVector",
            type: "Collection(Edm.Single)" as const,
            searchable: true,
            vectorSearchDimensions: 1536,
            vectorSearchProfileName: "my-vector-profile",
            hidden: true
        },
        {
            name: "Category",
            type: "Edm.String" as const,
            sortable: true,
            filterable: true,
            facetable: true,
            searchable: true,
            hidden: false
        },
        {
            name: "Tags",
            type: "Collection(Edm.String)" as const,
            searchable: true,
            filterable: true,
            facetable: true,
            hidden: false
        },
        {
            name: "ParkingIncluded",
            type: "Edm.Boolean" as const,
            filterable: true,
            sortable: true,
            facetable: true
        },
        {
            name: "LastRenovationDate",
            type: "Edm.DateTimeOffset" as const,
            filterable: true,
            sortable: true,
            facetable: true
        },
        {
            name: "Rating",
            type: "Edm.Double" as const,
            filterable: true,
            sortable: true,
            facetable: true
        },
        {
            name: "Address",
            type: "Edm.ComplexType" as const,
            fields: [
                {
                    name: "StreetAddress",
                    type: "Edm.String" as const,
                    searchable: true,
                },
                {
                    name: "City",
                    type: "Edm.String" as const,
                    filterable: true,
                    sortable: true,
                    facetable: true,
                    hidden: false,
                    searchable: true
                },
                {
                    name: "StateProvince",
                    type: "Edm.String" as const,
                    filterable: true,
                    sortable: true,
                    facetable: true,
                    hidden: false,
                    searchable: true
                },
                {
                    name: "PostalCode",
                    type: "Edm.String" as const,
                    filterable: true,
                    sortable: true,
                    facetable: true,
                    searchable: true
                },
                {
                    name: "Country",
                    type: "Edm.String" as const,
                    filterable: true,
                    sortable: true,
                    facetable: true,
                    searchable: true,
                }
            ]
        },
        {
            name: "Location",
            type: "Edm.GeographyPoint" as const,
            filterable: true,
            sortable: true
        }
    ];

    // Define vector search configuration
    const vectorSearch: VectorSearch = {
        algorithms: [
            {
                name: "hnsw-vector-config",
                kind: "hnsw" as const
            },
            {
                name: "eknn-vector-config",
                kind: "exhaustiveKnn" as const
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
    const semanticSearch: SemanticSearch = {
        configurations: [semanticConfig]
    };

    // Define suggesters
    const suggesters: SearchSuggester[] = [];

    // Create the search index with the semantic settings
    const indexDefinition: SearchIndex = {
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

    if (process.env.INDEX_DATA_LOADED_ === "true") {
        return;
    }

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

        //await deleteIndex(searchIndexClient);
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