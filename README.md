# JavaScript samples for Azure AI Search

This repository contains JavaScript code samples used in Azure AI Search documentation. Unless noted otherwise, all samples run on the shared (free) pricing tier of an [Azure AI Search service](https://learn.microsoft.com/azure/search/search-create-service-portal).

| Sample | Description |
|--------|-------------|
| [azure-function-search](azure-function-search/readme.md) | This sample is an Azure Function that sends query requests to an Azure AI Search service. You can substitute this code to replace the contents of the `api` folder in the C# sample [azure-search-static-web-app](https://github.com/Azure-Samples/azure-search-static-web-app). |
| [bulk-insert](bulk-insert/readme.md) | This sample shows you how to create and load an index using the push APIs and sample data. You can substitute this code to replace the contents of the `bulk-insert` folder in the C# sample [azure-search-static-web-app](https://github.com/Azure-Samples/azure-search-static-web-app) |
| [quickstart-keyword-search](quickstart-keyword-search/README.md) | "Day One" introduction to the fundamental tasks of working with a search index: create, load, and query. This sample is a  Node.js console app. The index is modeled on a subset of the Hotels dataset, reduced for readability and comprehension. |
| [quickstart-agentic-retrieval-js](quickstart-agentic-retrieval-js/README.md) | JavaScript code that demonstrates agentic retrieval in Azure AI Search, including creating a knowledge source, knowledge base, and using an LLM for query planning and answer synthesis. |
| [quickstart-agentic-retrieval-ts](quickstart-agentic-retrieval-ts/README.md) | TypeScript version of the agentic retrieval sample. |
| [quickstart-semantic-ranking-js](quickstart-semantic-ranking-js/README.md) | JavaScript code that demonstrates how to use semantic ranking in Azure AI Search to improve search relevance using machine reading comprehension. |
| [quickstart-semantic-ranking-ts](quickstart-semantic-ranking-ts/README.md) | TypeScript version of the semantic ranking sample. |
| [quickstart-vector-js](quickstart-vector-js/README.md) | JavaScript code that demonstrates vector search in Azure AI Search, including creating vector indexes and performing vector, hybrid, and semantic hybrid queries. |
| [quickstart-vector-ts](quickstart-vector-ts/README.md) | TypeScript version of the vector search sample. |