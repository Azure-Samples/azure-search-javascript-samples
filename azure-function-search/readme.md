---
page_type: sample
languages:
  - javascript
name: "Tutorial: Create an Azure function that specifies queries using JavaScript"
description: |
  Creates an Azure function that formulates queries, document lookup, and suggestions for typeahead queries.
products:
  - azure
  - azure-cognitive-search
  - azure-functions
urlFragment: javascript-azure-function-search
---

# Tutorial: Create an Azure function that specifies queries using JavaScript

![Tutorial sample MIT license badge](https://img.shields.io/badge/license-MIT-green.svg)

This sample provides an Azure function that formulates queries, document lookup, and suggestions for typeahead queries against an Azure AI Search index.

## What's in this sample

| File | Description |
|------|-------------|
| `package.json` | Project file that defines dependencies |
| `host.json` | Azure Functions host configuration |
| `local.settings.sample.json` | Template for local settings configuration |
| `src/functions/search.js` | Function that executes search queries |
| `src/functions/lookup.js` | Function that retrieves a document by ID |
| `src/functions/suggest.js` | Function that provides typeahead suggestions |
| `src/functions/status.js` | Function that returns service status |
| `src/lib/config.js` | Configuration helper for search service connection |
| `src/lib/azure-cognitive-search.js` | Search client wrapper |

## Documentation

This sample is the JavaScript version of the `api` content used in [Tutorial: Add search to web apps](https://learn.microsoft.com/azure/search/tutorial-csharp-overview). You can substitute this code to create a JavaScript version of the sample app.

## Next step

You can learn more about Azure AI Search on the [official documentation site](https://learn.microsoft.com/azure/search).
