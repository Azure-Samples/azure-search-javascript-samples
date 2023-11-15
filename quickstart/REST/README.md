# Quickstart sample for Azure AI Search with Node.js

![Quickstart sample MIT license badge](https://img.shields.io/badge/license-MIT-green.svg)

Demonstrates using Node.js and the Azure AI Search REST APIs to create an index, load it with documents, and execute a few queries. The index is modeled on a subset of the Hotels dataset, reduced for readability and comprehension. Index definition and documents are included in the code.

This Node.js console application is featured in [Node.js Quickstart: Create, load, and query indexes using Azure AI Search REST APIs](https://docs.microsoft.com/azure/search/search-get-started-nodejs). When you run the program, a console window emits output messages for each step: deleting and then re-creating a hotels-quickstart index, loading documents, running queries. This sample uses the [REST API](https://docs.microsoft.com/en-us/rest/api/searchservice/) and runs on a search service using connection information that you provide.

## Contents

| File/folder | Description |
|-------------|-------------|
| `index.js` | The main program |
| `AzureSearchClient.js` | Defines a class that can makes REST API requests. |
| `azure_search_config.json` | Key-value configuration data. | 
| `hotels_quickstart_index.json` | Specifies the structure of a search index. | 
| `hotels.json` | A small amount of sample data to populate the index. | 
| `package.json` | The Node project definition file. | 
| `package-lock.json` | The version dependencies of the project. | 
| `.eslintrc` | Coding standards used by [ESLint](https://eslint.org/). |
| `.prettierrc` | Formatting standards used by [Prettier](https://prettier.io/). | 
| `.gitignore` | Define what to ignore at commit time. |
| `CONTRIBUTING.md` | Guidelines for contributing to the sample. |
| `README.md` | This README file. |
| `LICENSE.md`   | The license for the sample. |

## Prerequisites

+ [Node.js](https://nodejs.org).
+ [NPM](https://www.npmjs.com) should be installed by Node.js.
+ [Create a search service in the portal](search-create-service-portal.md) or [find an existing service](https://ms.portal.azure.com/#blade/HubsExtension/BrowseResourceBlade/resourceType/Microsoft.Search%2FsearchServices) under your current subscription. You can use a free service for this quickstart.

Recommended:

* [Visual Studio Code](https://code.visualstudio.com).
* [Prettier](https://marketplace.visualstudio.com/items?itemName=esbenp.prettier-vscode) and [ESLint](https://marketplace.visualstudio.com/items?itemName=dbaeumer.vscode-eslint) extensions for VSCode.

## Setup

1. Clone or download this sample repository.
1. Run the following command to install the node dependencies.
    ```bash
    npm install 
    ```
1. Modify the values in `azure_search_config.json` 
    1. Replace `[SEARCH_SERVICE_NAME]` with the name of your search service. 
    1. Replace `[SEARCH_SERVICE_ADMIN_KEY]` with either of the admin keys of your search service.
    1. Replace `[SEARCH_SERVICE_QUERY_KEY]` with the query key of your search service

### Running quickstart

1. Run the following command to start the program.
    ```bash
    node index.js
    ```

You should see a series of messages relating to the creation of the search index, adding documents to it, and, finally, results of a series of queries.

## Key concepts 

The file **hotels_quickstart_index.json** holds the definition of an index for the data in the file **hotels.json**. Review those files to see the fields, which ones are searchable, etc. 

The file **AzureSearchClient.js** defines a class, `AzureSearchClient` that knows how to construct the URLs of the REST API and prepare and execute an HTTP request using the `fetch` API. It uses the query API key for queries and, otherwise, uses the admin API key. 

The file **index.js** reads the **azure_search_config.json** file, and passes the configuration data it finds there to the constructor of `AzureSearchClient`. The `sleep` function is used to pause execution in between major steps such as creating the index, submitting data for indexing, etc. Such pauses are generally only needed in test, demo, and sample code. 

The `run` function :

* Checks if the `hotels-quickstart` index exists.
* If so, the program deletes the existing index.
* Creates a new `hotels-quickstart` index from the structure in **hotels_quickstart_index.json**.
* Adds the data from **hotels.json** to the `hotels-quickstart` index.
* Executes a few basic queries against the search index.

## Next steps 

You can learn more about Azure AI Search on the [official documentation site](https://docs.microsoft.com/azure/search/).

