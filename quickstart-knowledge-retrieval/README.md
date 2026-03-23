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

> **This sample is archived.** For the official quickstart sample, see the [main branch](https://github.com/Azure-Samples/azure-search-javascript-samples/tree/main/quickstart-agentic-retrieval-ts).

![Archived sample MIT license badge](https://img.shields.io/badge/license-MIT-green.svg)

This archived sample provides an alternative multi-file approach to agentic retrieval using Azure AI Search. It demonstrates the same functionality as the quickstart but organizes the code into separate files for index creation, document upload, and knowledge retrieval.

## What's in this sample

| File | Description |
|------|-------------|
| `package.json` | Project file that defines dependencies |
| `tsconfig.json` | TypeScript compiler configuration |
| `sample.env` | Environment variable template for configuration |
| `src/createIndex.ts` | Defines the search index schema with vector fields and semantic configuration |
| `src/uploadDocuments.ts` | Contains sample hotel documents with precomputed vector embeddings |
| `src/main.ts` | Main orchestration script that demonstrates the complete workflow |

## Why this sample is archived

This multi-file sample was replaced by a single-file version that better aligns with the [quickstart tutorial format](https://learn.microsoft.com/azure/search/search-get-started-agentic-retrieval?pivots=typescript). This archived version may be useful for:

- How-to articles requiring modular code examples
- Developers who prefer a multi-file project structure

## Documentation

For the official quickstart, see [Quickstart: Agentic retrieval using TypeScript](https://learn.microsoft.com/azure/search/search-get-started-agentic-retrieval?pivots=typescript).

## Next step

You can learn more about Azure AI Search on the [official documentation site](https://learn.microsoft.com/azure/search).
