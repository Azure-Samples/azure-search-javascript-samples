---
page_type: sample
languages:
  - typescript
name: "[ARCHIVED] Agentic retrieval in Azure AI Search using TypeScript"
description: |
  Archived multi-file agentic retrieval sample. For the quickstart, see the main branch.
products:
  - azure
  - azure-cognitive-search
urlFragment: typescript-agentic-retrieval-archived
---

# [ARCHIVED] Agentic retrieval in Azure AI Search using TypeScript

![Archived sample MIT license badge](https://img.shields.io/badge/license-MIT-green.svg)

> **This sample is archived.** For the official quickstart sample, see the [main branch](https://github.com/Azure-Samples/azure-search-javascript-samples/tree/main/quickstart-agentic-retrieval-ts).

This archived sample demonstrates the fundamentals of agentic retrieval using Azure AI Search. You create a search index, a knowledge source that targets the index, and a knowledge base that integrates an LLM for query planning and answer synthesis.

## What's in this sample

| File | Description |
|------|-------------|
| `package.json` | Project file that defines dependencies |
| `tsconfig.json` | TypeScript compiler configuration |
| `sample.env` | Environment variable template for configuration |
| `src/createIndex.ts` | Defines the search index schema with vector fields and semantic configuration |
| `src/uploadDocuments.ts` | Contains sample hotel documents with precomputed vector embeddings |
| `src/main.ts` | Main orchestration script that demonstrates the complete workflow |

## Documentation

This sample is an alternative to the approach used in [Quickstart: Agentic retrieval using TypeScript](https://learn.microsoft.com/azure/search/search-get-started-agentic-retrieval?pivots=typescript). Follow the documentation for prerequisites, setup instructions, and detailed explanations.

## Next step

You can learn more about Azure AI Search on the [official documentation site](https://learn.microsoft.com/azure/search).
