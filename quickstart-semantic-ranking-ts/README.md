---
page_type: sample
languages:
  - typescript
name: "Quickstart: Semantic ranking in Azure AI Search using TypeScript"
description: |
  Demonstrates semantic ranking capabilities to improve search relevance using Azure AI Search.
products:
  - azure
  - azure-cognitive-search
urlFragment: typescript-semantic-ranking-quickstart
---

# Quickstart: Semantic ranking in Azure AI Search using TypeScript

![Quickstart sample MIT license badge](https://img.shields.io/badge/license-MIT-green.svg)

This sample demonstrates how to set up semantic ranking. You add a semantic configuration to a search index, and then you add semantic parameters to a query.

## What's in this sample

| File | Description |
|------|-------------|
| `package.json` | Project file that defines dependencies and npm scripts |
| `tsconfig.json` | TypeScript compiler configuration |
| `sample.env` | Environment variable template for configuration |
| `src/config.ts` | Configuration class for search service connection |
| `src/getIndexSettings.ts` | Retrieves index schema and semantic configuration |
| `src/updateIndexSettings.ts` | Adds semantic configuration to an index |
| `src/semanticQuery.ts` | Runs basic semantic ranking queries |
| `src/semanticQueryReturnCaptions.ts` | Runs semantic queries with captions and highlights |
| `src/semanticAnswer.ts` | Returns semantic answers from query results |

## Documentation

This sample accompanies [Quickstart: Semantic ranking using TypeScript](https://learn.microsoft.com/azure/search/search-get-started-semantic?pivots=typescript). Follow the documentation for prerequisites, setup instructions, and detailed explanations.

## Next step

You can learn more about Azure AI Search on the [official documentation site](https://learn.microsoft.com/azure/search).
