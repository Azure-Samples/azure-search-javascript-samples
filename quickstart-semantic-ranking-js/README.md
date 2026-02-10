---
page_type: sample
languages:
  - javascript
name: "Quickstart: Semantic ranking in Azure AI Search using JavaScript"
description: |
  Demonstrates semantic ranking capabilities to improve search relevance using Azure AI Search.
products:
  - azure
  - azure-cognitive-search
urlFragment: javascript-semantic-ranking-quickstart
---

# Quickstart: Semantic ranking in Azure AI Search using JavaScript

![Quickstart sample MIT license badge](https://img.shields.io/badge/license-MIT-green.svg)

This sample demonstrates how to set up semantic ranking. You add a semantic configuration to a search index, and then you add semantic parameters to a query.

## What's in this sample

| File | Description |
|------|-------------|
| `package.json` | Project file that defines dependencies and npm scripts |
| `sample.env` | Environment variable template for configuration |
| `src/config.js` | Configuration class for search service connection |
| `src/getIndexSettings.js` | Retrieves index schema and semantic configuration |
| `src/updateIndexSettings.js` | Adds semantic configuration to an index |
| `src/semanticQuery.js` | Runs basic semantic ranking queries |
| `src/semanticQueryReturnCaptions.js` | Runs semantic queries with captions and highlights |
| `src/semanticAnswer.js` | Returns semantic answers from query results |

## Documentation

This sample accompanies [Quickstart: Semantic ranking using JavaScript](https://learn.microsoft.com/azure/search/search-get-started-semantic?pivots=javascript). Follow the documentation for prerequisites, setup instructions, and detailed explanations.

## Next step

You can learn more about Azure AI Search on the [official documentation site](https://learn.microsoft.com/azure/search).
