---
page_type: sample
languages:
- javascript
- typescript
- nodejs
name: "Azure Cognitive Search JavaScript Samples repository"
description: "This repository contains JavaScript sample code used in Azure Cognitive Search quickstarts, tutorials, and examples."
products:
- azure
- azure-cognitive-search
- azure-static-web-app
- azure-portal
---

# Azure Cognitive Search JavaScript Samples repository

This repository contains JavaScript sample code used in Azure Cognitive Search documentation. Currently, this repository contains two samples.

## Quickstart

This Node.js console app uses Azure Cognitive Search to create an index, load it with documents, and execute a few queries. The index is modeled on a subset of the Hotels dataset, reduced for readability and comprehension. Index definition and documents are included in the code.

This sample is available in two versions:

+ **quickstart/REST** calls Azure Cognitive Search's REST APIs directly
+ **quickstart/v11** uses the [@azure/search-documents](https://docs.microsoft.com/javascript/api/overview/azure/search-documents-readme?view=azure-node-latest) client libraries and is the recommended approach

You can view additional samples for JavaScript/TypeScript in the [azure-sdk-for-js repo](https://github.com/Azure/azure-sdk-for-js/tree/master/sdk/search/search-documents/samples).

## Searchable web app

This sample adds search to a book catalog web app. Configuration and run time instructions can be found in the [sample readme](/search-website-functions-v4/README.md). The sample includes:

+ Bulk import script: Create a new index in your search service called `good-books`.

+ Client: React website for [Azure Cognitive Search](https://docs.microsoft.com/azure/search/search-what-is-azure-search): the client application provides the search user interface.

+ Server:  Function app that calls the Azure.Search.Documents query a search index.: It leverages the Azure SDK for JavaScript/TypeScript for Cognitive Search. See the [Overview](https://learn.microsoft.com//javascript/api/overview/azure/search-documents-readme) or [API Reference](https://learn.microsoft.com/javascript/api/@azure/search-documents/) for more information.

The sample is designed to be deployed as an [Azure Static Web app](https://docs.microsoft.com/azure/static-web-apps/).
