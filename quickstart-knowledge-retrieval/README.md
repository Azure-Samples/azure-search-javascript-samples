# Azure AI Search - Knowledge Retrieval Quickstart

This sample demonstrates how to use Azure AI Search's Knowledge Retrieval capabilities to build a RAG (Retrieval Augmented Generation) solution using TypeScript. It shows how to create a search index, configure it as a knowledge source, and integrate with Azure OpenAI for intelligent question answering.

## Features

- Creates a search index with vector embeddings
- Configures semantic search capabilities
- Sets up a knowledge source from the search index
- Integrates with Azure OpenAI for answer synthesis
- Demonstrates knowledge retrieval with chat interface

## Prerequisites

- Node.js 18 or later
- Azure subscription
- Azure AI Search service
- Azure OpenAI service with:
  - An embedding model deployment (e.g., `text-embedding-3-large`)
  - A GPT model deployment (e.g., `gpt-4.1-mini`)
- Azure CLI (for authentication)

## Setup

1. Install dependencies:
   ```bash
   npm install
   ```

2. Copy `sample.env` to `.env` and update with your values:
   ```bash
   cp sample.env .env
   ```

3. Configure the following environment variables:
   - `AZURE_SEARCH_ENDPOINT` - Your Azure AI Search endpoint
   - `AZURE_SEARCH_INDEX_NAME` - Name for the search index
   - `AOAI_ENDPOINT` - Your Azure OpenAI endpoint
   - `AOAI_EMBEDDING_MODEL` - OpenAI embedding model name
   - `AOAI_EMBEDDING_DEPLOYMENT` - Deployment name for embeddings
   - `AOAI_GPT_MODEL` - GPT model name
   - `AOAI_GPT_DEPLOYMENT` - Deployment name for GPT

4. Sign in to Azure CLI:
   ```bash
   az login
   ```

## Run the Sample

Build and run the complete workflow:
```bash
npm start
```

This will:
1. Create a search index with hotel data
2. Upload sample documents with vector embeddings
3. Configure a knowledge source pointing to the index
4. Create a knowledge base with Azure OpenAI integration
5. Perform a sample knowledge retrieval query

## Project Structure

- `src/createIndex.ts` - Defines the search index schema with vector fields and semantic configuration
- `src/uploadDocuments.ts` - Contains sample hotel documents with pre-computed vector embeddings
- `src/main.ts` - Main orchestration script that demonstrates the complete workflow

## Learn More

- [Azure AI Search Documentation](https://learn.microsoft.com/azure/search/)
- [Knowledge Retrieval in Azure AI Search](https://learn.microsoft.com/azure/search/knowledge-retrieval-overview)
- [Azure OpenAI Service](https://learn.microsoft.com/azure/ai-services/openai/)
