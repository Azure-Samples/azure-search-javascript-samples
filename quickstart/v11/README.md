---
page_type: sample
languages:
  - javascript
  - nodejs
name: Azure Cognitive Search Quickstart in Javascript
description: "Learn basic steps for creating, loading, and querying an Azure Cognitive Search index using the Azure SDK for Javascipt/Typescript"
products:
  - azure
  - azure-cognitive-search
urlFragment: javascript-quickstart
---

# Quickstart sample for Azure Cognitive Search with Node.js

![Quickstart sample MIT license badge](https://img.shields.io/badge/license-MIT-green.svg)

Demonstrates using Javascript and the [Azure SDK for Javascript/Typescript](https://docs.microsoft.com/javascript/api/overview/azure/search-documents-readme?view=azure-node-latest) to create an Azure Cognitive Search index, load it with documents, and execute a few queries. The index is modeled on a subset of the Hotels dataset, reduced for readability and comprehension. Index definition and documents are included in the code.

This Node.js console application is featured in [Node.js Quickstart: Create, load, and query indexes using Azure Cognitive Search REST APIs](https://docs.microsoft.com/azure/search/search-get-started-nodejs). When you run the program, a console window emits output messages for each step: deleting and then re-creating a hotels-quickstart index, loading documents, running queries. This sample uses the [Azure SDK for Javascript/Typescript](https://docs.microsoft.com/javascript/api/overview/azure/search-documents-readme?view=azure-node-latest) and runs on a search service using connection information that you provide.

## Contents

| File/folder | Description |
|-------------|-------------|
| `index.js` | The main program. |
| `hotels_quickstart_index.json` | Specifies the structure of a search index. | 
| `hotels.json` | A small amount of sample data to populate the index. | 
| `package.json` | The Node project definition file. | 
| `package-lock.json` | The version dependencies of the project. |
| `.gitignore` | Define what to ignore at commit time. |
| `CONTRIBUTING.md` | Guidelines for contributing to the sample. |
| `README.md` | This README file. |
| `LICENSE.md`   | The license for the sample. |

## Prerequisites

+ [Node.js](https://nodejs.org).
+ [NPM](https://www.npmjs.com) should be installed by Node.js.
+ [Create a search service in the portal](search-create-service-portal.md) or [find an existing service](https://ms.portal.azure.com/#blade/HubsExtension/BrowseResourceBlade/resourceType/Microsoft.Search%2FsearchServices) under your current subscription. You can use a free service for this quickstart.
+ [Visual Studio Code](https://code.visualstudio.com) or another IDE.

## Setup

1. Clone or download this sample repository.
1. Open the folder in VS Code and navigate to the quickstart/v11 folder:

   ```cmd
   cd quickstart/v11
   ```

1. Install the dependencies using `npm`:

    ```bash
    npm install
    ```

1. Edit the file `sample.env`, adding the correct credentials to access your Azure Cognitive Search service.
1. Rename the file from `sample.env` to just `.env`. The quickstart will read the `.env` file automatically.

### Running the quickstart

1. Run the following command to start the program.

    ```bash
    node index.js
    ```

You should see a series of messages relating to the creation of the search index, adding documents to it, and, finally, results of a series of queries.

## Key concepts

The file **hotels_quickstart_index.json** holds the definition of an index for the data in the file **hotels.json**. Review those files to see the fields, which ones are searchable, etc.

The file **index.js** automatically reads the **.env** file which contains the  `SEARCH_API_KEY` and `SEARCH_API_ENDPOINT` needed to create the `SearchIndexClient`. The `sleep` function is used to pause execution in between major steps such as creating the index, submitting data for indexing, etc. Such pauses are generally only needed in test, demo, and sample code.

The `run` function :

+ Checks if the `hotels-quickstart` index exists.
+ If so, the program deletes the existing index.
+ Creates a new `hotels-quickstart` index from the structure in **hotels_quickstart_index.json**.
+ Adds the data from **hotels.json** to the `hotels-quickstart` index.
+ Executes a few basic queries against the search index.

## Next steps

You can learn more about Azure Cognitive Search on the [official documentation site](https://docs.microsoft.com/azure/search/).

You can view additional samples for Javascript/Typescript in the [azure-sdk-for-js repo](https://github.com/Azure/azure-sdk-for-js/tree/master/sdk/search/search-documents/samples) or see the [documentation](https://docs.microsoft.com/javascript/api/overview/azure/search-documents-readme?view=azure-node-latest).
