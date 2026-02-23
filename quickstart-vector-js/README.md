---
page_type: sample
languages:
  - javascript
name: "Quickstart: Vector search in Azure AI Search using JavaScript"
description: |
  Demonstrates vector search capabilities using Azure AI Search with HNSW algorithm.
products:
  - azure
  - azure-cognitive-search
urlFragment: javascript-vector-quickstart
---

# Quickstart: Vector search in Azure AI Search using JavaScript

![Quickstart sample MIT license badge](https://img.shields.io/badge/license-MIT-green.svg)

This sample demonstrates the fundamentals of vector search, including creating a vector index, loading documents with embeddings, and running vector and hybrid queries.

## What's in this sample

| File | Description |
|------|-------------|
| `package.json` | Project file that defines dependencies |
| `sample.env` | Environment variable template for configuration |
| `src/createIndex.js` | Creates a search index with vector field configurations |
| `src/deleteIndex.js` | Deletes an existing search index |
| `src/uploadDocuments.js` | Uploads documents with precomputed embeddings |
| `src/queryVector.js` | Precomputed sample query vector |
| `src/search*.js` | Runs vector, hybrid, and semantic hybrid queries |

## Documentation

This sample accompanies [Quickstart: Vector search using JavaScript](https://learn.microsoft.com/azure/search/search-get-started-vector?pivots=javascript). Follow the documentation for prerequisites, setup instructions, and detailed explanations.

## Next step

You can learn more about Azure AI Search on the [official documentation site](https://learn.microsoft.com/azure/search).
