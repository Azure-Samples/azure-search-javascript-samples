# Azure AI Search Semantic Ranking Quickstart - TypeScript

This TypeScript sample demonstrates how to use semantic ranking in Azure AI Search to improve search relevance using machine reading comprehension. This is a TypeScript port of the [official Python quickstart](https://learn.microsoft.com/en-us/azure/search/search-get-started-semantic).

The sample has been refactored into a modular structure, similar to the vector search quickstart, with separate files for different operations.

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
     SEARCH_API_KEY=your-admin-api-key
     INDEX_NAME=hotels-quickstart
     ```

4. **Get your search service endpoint and API key**
   - Sign in to the [Azure portal](https://portal.azure.com/)
   - Find your search service
   - Copy the URL from the Overview page
   - Copy an admin key from the Keys page

## Run the Sample

### Run Complete Quickstart
```bash
# Build and run the complete quickstart
npm run dev

# Or separately:
npm run build
npm run start
```

### Run Individual Operations
You can also run individual operations separately:

```bash
# Create the search index with semantic configuration
npm run create-index

# Upload sample documents
npm run upload-docs

# Run BM25 text search
npm run search-bm25

# Run semantic search with reranking
npm run search-semantic

# Run semantic search with answers
npm run search-answers

# Delete the index (useful for testing)
npm run delete-index
```

## What This Sample Does

The quickstart demonstrates the key steps for implementing semantic ranking:

1. **Creates a search index** with semantic configuration
   - Defines fields for hotel data (HotelName, Description, Category, etc.)
   - Sets up semantic configuration specifying:
     - **Title field**: HotelName (most important for ranking)
     - **Content fields**: Description (main content to analyze)  
     - **Keywords fields**: Category (additional context)

2. **Uploads sample documents** containing hotel information with varied descriptions

3. **Runs different types of queries** to show the difference:
   - **Empty query**: Verifies the index is operational
   - **Text query with BM25**: Traditional keyword-based scoring
   - **Semantic query**: AI-powered reranking with captions
   - **Semantic answers**: Direct answer extraction from content

## Key Features Demonstrated

### Semantic Configuration
Shows how to configure semantic search with prioritized fields:
- **Title field**: The most important field for semantic ranking
- **Content fields**: Fields containing the main content to be analyzed
- **Keywords fields**: Fields providing additional context

### Query Comparison
- **BM25 scoring**: Traditional keyword matching with frequency-based relevance
- **Semantic reranking**: AI understanding of context and meaning
- **Reranker scores**: Higher scores indicate better semantic relevance to the query

### Enhanced Results
- **Semantic Captions**: Automatically extracted relevant snippets with highlighting
- **Semantic Answers**: Direct responses to question-like queries when confidence is high

## Understanding the Results

When you run the sample, you'll see different results for the same query "restaurant on site":

**BM25 Results**: May prioritize documents that simply contain the words "restaurant" and "site"

**Semantic Results**: Will understand the intent and rank hotels that actually have dining facilities higher, even if they don't use the exact words

## Example Output

```
=== Running text query (BM25 scoring) ===
BM25-scored results:
Score: 1.23
Hotel: Sublime Palace Hotel
Description: ...historic center...sites and landmarks...

=== Running semantic query ===
Semantic-ranked results:
Reranker Score: 2.45
Hotel: Gastronomic Landscape Hotel
Description: The Gastronomic Hotel stands out for its culinary excellence...
Caption: culinary excellence under the management of William Dough, who advises on and oversees all of the Hotel's restaurant services
```

## Project Structure

The sample has been refactored into a modular structure for better maintainability and reusability:

```
quickstart-semantic-ranking-ts/
├── src/
│   ├── config.ts                    # Configuration and type definitions
│   ├── createIndex.ts               # Index creation with semantic configuration
│   ├── uploadDocuments.ts           # Document upload functionality  
│   ├── searchBM25.ts               # BM25 text search queries
│   ├── searchSemantic.ts           # Semantic search with reranking
│   ├── searchSemanticAnswer.ts     # Semantic search with answers
│   ├── main.ts                     # Main orchestration script
│   └── semantic-ranking-quickstart.ts  # Original monolithic version (for reference)
├── dist/                           # Compiled JavaScript (generated)
├── package.json                    # Node.js dependencies and scripts  
├── tsconfig.json                   # TypeScript configuration
├── sample.env                      # Environment variables template
└── README.md                      # This file
```

## Modular Code Overview

### Configuration (`config.ts`)
- Centralizes environment variables and credentials
- Exports the `HotelDocument` interface for type safety
- Provides reusable configuration for all modules

### Index Creation (`createIndex.ts`)
- Creates the search index with semantic configuration
- Defines field mappings and analyzers
- Sets up semantic prioritized fields (title, content, keywords)

### Document Upload (`uploadDocuments.ts`)
- Uploads sample hotel documents to the index
- Handles batch upload operations with error handling

### Search Operations
- **`searchBM25.ts`**: Traditional keyword-based search with BM25 scoring
- **`searchSemantic.ts`**: Semantic search with AI-powered reranking and captions  
- **`searchSemanticAnswer.ts`**: Semantic search with direct answer extraction

### Main Orchestrator (`main.ts`)
- Coordinates all operations in the correct sequence
- Provides validation and error handling
- Can be used as the primary entry point

## Benefits of the Modular Structure

This refactored structure provides several advantages:

- **Modularity**: Each file has a single responsibility and can be used independently
- **Reusability**: Individual operations can be imported and used in other projects
- **Testability**: Each module can be tested in isolation
- **Maintainability**: Changes to one operation don't affect others
- **Educational**: Easier to understand each concept separately
- **Flexibility**: Run only the operations you need during development

## Semantic Configuration Details

```typescript
const semanticConfig = {
    name: "semantic-config", 
    prioritizedFields: {
        titleField: { name: "HotelName" },        // Primary ranking field
        contentFields: [{ name: "Description" }], // Main content for analysis  
        keywordsFields: [{ name: "Category" }]    // Additional context
    }
};
```

## Learn More

- [Azure AI Search Semantic Ranking Documentation](https://learn.microsoft.com/en-us/azure/search/semantic-search-overview)
- [Original Python Quickstart](https://learn.microsoft.com/en-us/azure/search/search-get-started-semantic)
- [Azure SDK for JavaScript Documentation](https://docs.microsoft.com/en-us/javascript/api/@azure/search-documents/)
- [Semantic Search Best Practices](https://learn.microsoft.com/en-us/azure/search/semantic-how-to-query-request)

## Troubleshooting

- **Service Requirements**: Ensure your search service has semantic ranker enabled (Basic tier or higher)
- **Configuration**: Verify your endpoint URL and API key are correct
- **Index Conflicts**: Check that the index name doesn't conflict with existing indexes  
- **SDK Version**: Make sure you have the latest version of the Azure Search Documents SDK
- **Field Configuration**: Ensure your semantic configuration references existing searchable fields

## Clean Up

The sample creates an index named "hotels-quickstart" by default. You can delete it easily:

```bash
npm run delete-index
```

Or programmatically:
```typescript
await indexClient.deleteIndex(indexName);
```

## Migration from Original Structure

This sample has been refactored from a single-file structure to a modular one:

**Before** (Single File):
- `semantic-ranking-quickstart.ts` - All functionality in one file

**After** (Modular Structure):
- `config.ts` - Configuration and types
- `createIndex.ts` - Index creation  
- `uploadDocuments.ts` - Document upload
- `searchBM25.ts` - BM25 search operations
- `searchSemantic.ts` - Semantic search
- `searchSemanticAnswer.ts` - Semantic answers
- `main.ts` - Orchestration script
- `deleteIndex.ts` - Cleanup utility

The original single-file version is preserved as `semantic-ranking-quickstart.ts` for reference.

## Related Samples

- [Vector Search Quickstart](../quickstart-vector-ts/) - Learn about vector search capabilities
- [RAG with TypeScript](../quickstart-rag-ts/) - Retrieval Augmented Generation patterns
