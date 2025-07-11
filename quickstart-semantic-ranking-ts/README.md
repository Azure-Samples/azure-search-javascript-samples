# Azure AI Search Semantic Ranking Quickstart - TypeScript

This TypeScript sample demonstrates how to use semantic ranking in Azure AI Search to improve search relevance using machine reading comprehension. This is a TypeScript version of the [quickstart](https://learn.microsoft.com/azure/search/search-get-started-semantic).

The sample has been factored into a modular structure, with separate files for different operations.

## What is Semantic Ranking?

Semantic ranking uses machine reading comprehension from Microsoft to rescore search results, promoting the most semantically relevant matches to the top of the list. Unlike traditional keyword-based BM25 scoring, semantic ranking understands context and meaning.

## Prerequisites

- An Azure account with an active subscription
- An Azure AI Search service (Basic tier or higher) with semantic ranker enabled
- Node.js 18+ and npm
- TypeScript

## Setup

1. **Clone or navigate to this directory**

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Configure your search service**
   - Copy `sample.env` to `.env`
   - Update the values with your Azure AI Search service details:
     ```
     SEARCH_ENDPOINT=https://your-service-name.search.windows.net
     INDEX_NAME=hotels-sample-index
     AZURE_SEARCH_API_KEY=your-api-key
     ```

4. **Get your search service endpoint and API key**
   - Sign in to the [Azure portal](https://portal.azure.com/)
   - Find your search service
   - Copy the URL from the Overview page
   - Copy an admin key from the Keys page

## Run the Sample

### Getting Index Settings
```bash
npm run get-index-settings
```

### Updating Index Settings for Semantic Search
```bash
npm run update-index-settings
```

### Run Semantic Queries
```bash
npm run get-semantic-query
```

### Get Captions with Results
```bash
npm run get-captions
```

### Get Semantic Answers
```bash
npm run get-answers
```
