# Azure Cognitive Search JavaScript Samples repository

This repository contains JavaScript sample code used in Azure Cognitive Search quickstarts, tutorials, and examples.

## Quickstart

This Node.js console app uses Azure Cognitive Search to create an index, load it with documents, and execute a few queries. The index is modeled on a subset of the Hotels dataset, reduced for readability and comprehension. Index definition and documents are included in the code.

This sample is available in two versions:

+ **REST** calls Azure Cognitive Search's REST APIs directly
+ **v11** uses the [@azure/search-documents](https://docs.microsoft.com/javascript/api/overview/azure/search-documents-readme?view=azure-node-latest) client libraries and is the recommmended approach

You can view additional samples for Javascript/Typescript in the [azure-sdk-for-js repo](https://github.com/Azure/azure-sdk-for-js/tree/master/sdk/search/search-documents/samples).

## Searchable website

Add search to a book catalog website. 

This sample includes:
* A React website for [Azure Cognitive Search](https://docs.microsoft.com/en-us/azure/search/search-what-is-azure-search): the client application provides the search user interface.
* A Function app which calls Azure Function API: It leverages the [Azure SDK for Javascript/Typescript](https://github.com/Azure/azure-sdk-for-js/tree/master/sdk/search/search-documents/).

This sample is designed to be deployed as an [Azure Static Web app](https://docs.microsoft.com/en-us/azure/static-web-apps/).