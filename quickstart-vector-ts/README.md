---
page_type: sample
languages:
  - typescript
name: "Quickstart: Vector search in Azure AI Search using TypeScript"
description: |
  Demonstrates vector search capabilities using Azure AI Search with HNSW algorithm.
products:
  - azure
  - azure-cognitive-search
urlFragment: typescript-vector-quickstart
---

# Quickstart: Vector search in Azure AI Search using TypeScript

![Quickstart sample MIT license badge](https://img.shields.io/badge/license-MIT-green.svg)

This sample demonstrates the fundamentals of vector search, including creating a vector index, loading documents with embeddings, and running vector and hybrid queries.

## What's in this sample

| File | Description |
|------|-------------|
| `package.json` | Project file that defines dependencies |
| `tsconfig.json` | TypeScript compiler configuration |
| `sample.env` | Environment variable template for configuration |
| `src/createIndex.ts` | Creates a search index with vector field configurations |
| `src/deleteIndex.ts` | Deletes an existing search index |
| `src/uploadDocuments.ts` | Uploads documents with precomputed embeddings |
| `src/queryVector.ts` | Precomputed sample query vector |
| `src/search*.ts` | Runs vector, hybrid, and semantic hybrid queries |

## Documentation

This sample accompanies [Quickstart: Vector search using TypeScript](https://learn.microsoft.com/azure/search/search-get-started-vector?pivots=typescript). Follow the documentation for prerequisites, setup instructions, and detailed explanations.

## Next step

You can learn more about Azure AI Search on the [official documentation site](https://learn.microsoft.com/azure/search).
