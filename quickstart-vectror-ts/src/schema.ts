const indexName = process.env.AZURE_SEARCH_INDEX || "vector-search-quickstart";

export const SCHEMA ={
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
                            fieldName: "HotelName"
                        },
                        contentFields: [
                            {
                                fieldName: "Description"
                            }
                        ],
                        keywordsFields: [
                            {
                                fieldName: "Category"
                            }
                        ]
                    }
                }
            ]
        },
        suggesters: [
            {
                name: "sg",
                sourceFields: ["Tags", "Address/City", "Address/Country"]
            }
        ]
    };