# JavaScript samples for Azure AI Search

This repository contains JavaScript code samples used in Azure AI Search documentation. Unless noted otherwise, all samples run on the shared (free) pricing tier of an [Azure AI Search service](https://learn.microsoft.com/azure/search/search-create-service-portal).

| Sample | Description |
|--------|-------------|
| [azure-function-search](azure-function-search/readme.md) | This sample is an Azure Function that sends query requests to an Azure AI Search service. You can substitute this code to replace the contents of the `api` folder in the C# sample [azure-search-static-web-app](https://github.com/Azure-Samples/azure-search-static-web-app). |
| [bulk-insert](bulk-insert/readme.md) | This sample shows you how to create and load an index using the push APIs and sample data. You can substitute this code to replace the contents of the `bulk-insert` folder in the C# sample [azure-search-static-web-app](https://github.com/Azure-Samples/azure-search-static-web-app) |
| [quickstart](quickstart/README.md) | "Day One" introduction to the fundamental tasks of working with a search index: create, load, and query. This sample is a  Node.js console app. The index is modeled on a subset of the Hotels dataset, reduced for readability and comprehension. |
| [quickstart-semantic-ranking-js](quickstart-semantic-ranking-js/README.md) | JavaScript code that demonstrates how to use semantic ranking in Azure AI Search to improve search relevance using machine reading comprehension. |
| [quickstart-semantic-ranking-ts](quickstart-semantic-ranking-ts/README.md) | TypeScript code that demonstrates how to use semantic ranking in Azure AI Search to improve search relevance using machine reading comprehension. |