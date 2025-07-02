import {
    SearchIndexClient,
    SearchIndex,
    SearchField,
    SemanticSearch,
    SearchSuggester
} from "@azure/search-documents";
import { searchEndpoint, indexName, credential } from "./config.js";

const indexClient = new SearchIndexClient(searchEndpoint, credential);

console.log('Creating semantic search index...');

// Define the fields for the index
const fields: SearchField[] = [
    {
        name: "HotelId",
        type: "Edm.String" as const,
        key: true
    },
    {
        name: "HotelName",
        type: "Edm.String" as const,
        searchable: true,
        sortable: true
    },
    {
        name: "Description",
        type: "Edm.String" as const,
        searchable: true,
        analyzerName: "en.lucene"
    },
    {
        name: "Category",
        type: "Edm.String" as const,
        searchable: true,
        facetable: true,
        filterable: true,
        sortable: true
    },
    {
        name: "Tags",
        type: "Collection(Edm.String)" as const,
        searchable: true,
        facetable: true,
        filterable: true
    },
    {
        name: "ParkingIncluded",
        type: "Edm.Boolean" as const,
        facetable: true,
        filterable: true,
        sortable: true
    },
    {
        name: "LastRenovationDate",
        type: "Edm.DateTimeOffset" as const,
        facetable: true,
        filterable: true,
        sortable: true
    },
    {
        name: "Rating",
        type: "Edm.Double" as const,
        facetable: true,
        filterable: true,
        sortable: true
    },
    {
        name: "Address",
        type: "Edm.ComplexType" as const,
        fields: [
            {
                name: "StreetAddress",
                type: "Edm.String" as const,
                searchable: true
            },
            {
                name: "City",
                type: "Edm.String" as const,
                searchable: true,
                facetable: true,
                filterable: true,
                sortable: true
            },
            {
                name: "StateProvince",
                type: "Edm.String" as const,
                searchable: true,
                facetable: true,
                filterable: true,
                sortable: true
            },
            {
                name: "PostalCode",
                type: "Edm.String" as const,
                searchable: true,
                facetable: true,
                filterable: true,
                sortable: true
            },
            {
                name: "Country",
                type: "Edm.String" as const,
                searchable: true,
                facetable: true,
                filterable: true,
                sortable: true
            }
        ]
    }
];

// Create semantic search configuration
const semanticConfig = {
    name: "semantic-config",
    prioritizedFields: {
        titleField: { name: "HotelName" },
        keywordsFields: [{ name: "Category" }],
        contentFields: [{ name: "Description" }]
    }
};

const semanticSearch: SemanticSearch = {
    configurations: [semanticConfig]
};

// Create empty suggester array for this example
const suggesters: SearchSuggester[] = [];

// Create the search index with semantic configuration
const indexDefinition: SearchIndex = {
    name: indexName,
    fields: fields,
    suggesters: suggesters,
    semanticSearch: semanticSearch
};

const result = await indexClient.createOrUpdateIndex(indexDefinition);
console.log(`Index '${result.name}' created successfully with semantic configuration`);
