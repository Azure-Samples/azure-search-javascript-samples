import dotenv from 'dotenv';
import { AzureCliCredential } from '@azure/identity';
import {
    SearchIndexClient,
    SearchClient,
    KnowledgeRetrievalClient
} from '@azure/search-documents';
import type {
    SearchIndexKnowledgeSource,
    SearchIndexKnowledgeSourceParameters,
    KnowledgeBase,
    KnowledgeBaseAzureOpenAIModel,
    AzureOpenAIParameters,
    KnowledgeSourceReference,
    KnowledgeBaseRetrievalRequest,
    KnowledgeBaseMessage,
    KnowledgeBaseMessageTextContent,
    SearchIndexKnowledgeSourceParams
} from '@azure/search-documents';
import { createHotelIndex, HotelDocument } from './createIndex.js';
import { uploadSampleDocuments } from './uploadDocuments.js';

// Take environment variables from .env
dotenv.config({ path: '.env', override: true });

// This file uses the following variables from your .env file
const searchEndpoint = process.env.AZURE_SEARCH_ENDPOINT || "https://your-search-service.search.windows.net";
const indexName = process.env.AZURE_SEARCH_INDEX_NAME || "hotel-index";
const aoaiEndpoint = process.env.AOAI_ENDPOINT;
const aoaiEmbeddingModel = process.env.AOAI_EMBEDDING_MODEL || "text-embedding-3-large";
const aoaiEmbeddingDeployment = process.env.AOAI_EMBEDDING_DEPLOYMENT || "text-embedding-3-large";
const aoaiGptModel = process.env.AOAI_GPT_MODEL || "gpt-4.1-mini";
const aoaiGptDeployment = process.env.AOAI_GPT_DEPLOYMENT || "gpt-4.1-mini";
const knowledgeSourceName = process.env.KNOWLEDGE_SOURCE_NAME || "hotel-knowledge-source";
const knowledgeBaseName = process.env.KNOWLEDGE_BASE_NAME || "hotel-knowledge-base";

console.log(`Using Azure Search endpoint: ${searchEndpoint}`);
console.log(`Using index name: ${indexName}`);

// Use AzureCliCredential directly for explicit az login authentication
const credential = new AzureCliCredential();

async function main() {
    const indexClient = new SearchIndexClient(searchEndpoint, credential);

    try {
        await indexClient.getIndex(indexName);
        console.log(`Index already exists: ${indexName}`);
    } catch {
        const index = await createHotelIndex(indexClient, indexName);
        await indexClient.createIndex(index);
        console.log(`Created index: ${indexName}`);
        await uploadSampleDocuments(indexClient.getSearchClient<HotelDocument>(indexName));
    }

    // Create or update knowledge source
    const knowledgeSource: SearchIndexKnowledgeSource = {
        name: knowledgeSourceName,
        kind: "searchIndex",
        description: "Knowledge source for my hotels data",
        searchIndexParameters: {
            searchIndexName: indexName,
            sourceDataFields: [
                { name: "Id" },
                { name: "Description" },
            ],
            semanticConfigurationName: "semantic-config"
        } as SearchIndexKnowledgeSourceParameters
    };

    await indexClient.createOrUpdateKnowledgeSource(knowledgeSourceName, knowledgeSource);
    console.log(`Knowledge source '${knowledgeSourceName}' created or updated successfully.`);

    // Create Azure OpenAI parameters
    const aoaiParams: AzureOpenAIParameters = {
        resourceUrl: aoaiEndpoint,
        deploymentId: aoaiGptDeployment,
        modelName: aoaiGptModel
    };

    // Create knowledge base
    const knowledgeBase: KnowledgeBase = {
        name: knowledgeBaseName,
        models: [{
            kind: "azureOpenAI",
            azureOpenAIParameters: aoaiParams
        } as KnowledgeBaseAzureOpenAIModel],
        knowledgeSources: [
            {
                name: knowledgeSourceName
            } as KnowledgeSourceReference
        ],
        outputMode: "answerSynthesis",
        answerInstructions: "Provide a 2 sentence concise and informative answer based on the retrieved documents."
    };

    await indexClient.createOrUpdateKnowledgeBase(knowledgeBaseName, knowledgeBase);
    console.log(`Knowledge base '${knowledgeBaseName}' created or updated successfully.`);

    // Create retrieval request
    const retrievalRequest: KnowledgeBaseRetrievalRequest = {
        messages: [
            {
                role: "user",
                content: [{
                    type: "text",
                    text: `
                    Give me a the hotels with spacious rooms and rooftop pools.
`
                } as KnowledgeBaseMessageTextContent]
            } as KnowledgeBaseMessage
        ],
        knowledgeSourceParams: [
            {
                knowledgeSourceName: knowledgeSourceName,
                kind: "searchIndex",
                includeReferences: true,
                includeReferenceSourceData: true,
                alwaysQuerySource: true
            } as SearchIndexKnowledgeSourceParams
        ],
        includeActivity: true,
        retrievalReasoningEffort: { kind: "low" }
    };

    // Perform retrieval
    const baseClient = new KnowledgeRetrievalClient(searchEndpoint, knowledgeBaseName, credential);
    const result = await baseClient.retrieveKnowledge(retrievalRequest);
    console.log("------------------ANSWER-------------------------------\n");    
    if (result.response && result.response[0]?.content?.[0]) {
        const content = result.response[0].content[0];
        if ('text' in content) {
            console.log(content.text);
        }
    }

    // Print references
    console.log("------------------REFERENCES-------------------------------\n");    

    if (result.references) {
        const referencesContent = JSON.stringify(result.references, null, 2);
        console.log("references_content:\n", referencesContent);
    } else {
        console.log("references_content:\n", "No references found on 'result'");
    }

    // Print activity
    console.log("------------------ACTIVITY-------------------------------\n");    

    if (result.activity) {
        const activityContent = JSON.stringify(result.activity, null, 2);
        console.log("activity_content:\n", activityContent, "\n");
    } else {
        console.log("activity_content:\n", "No activity found on 'result'", "\n");
    }
}

// Run the main function
main().catch((error) => {
    console.error("Error:", error);
    process.exit(1);
});
