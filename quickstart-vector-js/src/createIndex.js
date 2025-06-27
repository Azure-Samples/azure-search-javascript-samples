import { DefaultAzureCredential } from "@azure/identity";
import {
    SearchIndexClient
} from "@azure/search-documents";

const credential = new DefaultAzureCredential();
export const searchEndpoint = process.env.AZURE_SEARCH_ENDPOINT;
export const indexName = process.env.AZURE_SEARCH_INDEX_NAME;

console.log(`Using Azure Search endpoint: ${searchEndpoint}`);
console.log(`Using index name: ${indexName}`);

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


