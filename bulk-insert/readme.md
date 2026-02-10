---
page_type: sample
languages:
  - javascript
name: "Tutorial: Bulk insert documents in Azure AI Search using JavaScript"
description: |
  Creates and loads an Azure AI Search index using bulk insert operations with the good-books sample dataset.
products:
  - azure
  - azure-cognitive-search
urlFragment: javascript-bulk-insert
---

# Tutorial: Bulk insert documents in Azure AI Search using JavaScript

![Tutorial sample MIT license badge](https://img.shields.io/badge/license-MIT-green.svg)

This sample creates and loads a search index using bulk insert operations with the good-books sample dataset. It demonstrates efficient document indexing patterns for large datasets.

## What's in this sample

| File | Description |
|------|-------------|
| `package.json` | Project file that defines dependencies |
| `bulk_insert_books.js` | Main script that creates index and bulk inserts documents |
| `good-books-index.json` | Index schema definition for the books dataset |

## Documentation

This sample is the JavaScript version of the `bulk-insert` content used in [Tutorial: Add search to web apps](https://learn.microsoft.com/azure/search/tutorial-csharp-overview). You can substitute this code to create a JavaScript version of the sample app. You can also run this code on its own to create a good-books index on your search service.

## Next step

You can learn more about Azure AI Search on the [official documentation site](https://learn.microsoft.com/azure/search).
