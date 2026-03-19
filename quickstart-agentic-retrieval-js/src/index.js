import "dotenv/config";
import { DefaultAzureCredential } from "@azure/identity";
import {
  SearchIndexClient,
  SearchClient,
  KnowledgeRetrievalClient,
  SearchIndexingBufferedSender,
} from "@azure/search-documents";

export const documentKeyRetriever = (document) => {
  return document.id;
};

export const WAIT_TIME = 4000;
export function delay(timeInMs) {
  return new Promise((resolve) => setTimeout(resolve, timeInMs));
}

const index = {
  name: "earth_at_night",
  fields: [
    {
      name: "id",
      type: "Edm.String",
      key: true,
      filterable: true,
      sortable: true,
      facetable: true,
    },
    {
      name: "page_chunk",
      type: "Edm.String",
      searchable: true,
      filterable: false,
      sortable: false,
      facetable: false,
    },
    {
      name: "page_embedding_text_3_large",
      type: "Collection(Edm.Single)",
      searchable: true,
      filterable: false,
      sortable: false,
      facetable: false,
      vectorSearchDimensions: 3072,
      vectorSearchProfileName: "hnsw_text_3_large",
    },
    {
      name: "page_number",
      type: "Edm.Int32",
      filterable: true,
      sortable: true,
      facetable: true,
    },
  ],
  vectorSearch: {
    profiles: [
      {
        name: "hnsw_text_3_large",
        algorithmConfigurationName: "alg",
        vectorizerName: "azure_openai_text_3_large",
      },
    ],
    algorithms: [
      {
        name: "alg",
        kind: "hnsw",
      },
    ],
    vectorizers: [
      {
        vectorizerName: "azure_openai_text_3_large",
        kind: "azureOpenAI",
        parameters: {
          resourceUrl: process.env.AZURE_OPENAI_ENDPOINT,
          deploymentId: process.env.AZURE_OPENAI_EMBEDDING_DEPLOYMENT,
          modelName: process.env.AZURE_OPENAI_EMBEDDING_DEPLOYMENT,
        },
      },
    ],
  },
  semanticSearch: {
    defaultConfigurationName: "semantic_config",
    configurations: [
      {
        name: "semantic_config",
        prioritizedFields: {
          contentFields: [{ name: "page_chunk" }],
        },
      },
    ],
  },
};

const credential = new DefaultAzureCredential();

const searchIndexClient = new SearchIndexClient(
  process.env.AZURE_SEARCH_ENDPOINT,
  credential
);
const searchClient = new SearchClient(
  process.env.AZURE_SEARCH_ENDPOINT,
  "earth_at_night",
  credential
);

await searchIndexClient.createOrUpdateIndex(index);

// Get documents with vectors
const response = await fetch(
  "https://raw.githubusercontent.com/Azure-Samples/azure-search-sample-data/refs/heads/main/nasa-e-book/earth-at-night-json/documents.json"
);

if (!response.ok) {
  throw new Error(
    `Failed to fetch documents: ${response.status} ${response.statusText}`
  );
}
const documents = await response.json();

const bufferedClient = new SearchIndexingBufferedSender(
  searchClient,
  documentKeyRetriever,
  {
    autoFlush: true,
  }
);

await bufferedClient.uploadDocuments(documents);
await bufferedClient.flush();
await bufferedClient.dispose();

console.log(`Waiting for indexing to complete...`);
console.log(`Expected documents: ${documents.length}`);
await delay(WAIT_TIME);

let count = await searchClient.getDocumentsCount();
console.log(`Current indexed count: ${count}`);

while (count !== documents.length) {
  await delay(WAIT_TIME);
  count = await searchClient.getDocumentsCount();
  console.log(`Current indexed count: ${count}`);
}

console.log(`✓ All ${documents.length} documents indexed successfully!`);

await searchIndexClient.createKnowledgeSource({
  name: "earth-knowledge-source",
  description: "Knowledge source for Earth at Night e-book content",
  kind: "searchIndex",
  searchIndexParameters: {
    searchIndexName: "earth_at_night",
    sourceDataFields: [{ name: "id" }, { name: "page_number" }],
  },
});

console.log(`✅ Knowledge source 'earth-knowledge-source' created successfully.`);

await searchIndexClient.createKnowledgeBase({
  name: "earth-knowledge-base",
  knowledgeSources: [
    {
      name: "earth-knowledge-source",
    },
  ],
  models: [
    {
      kind: "azureOpenAI",
      azureOpenAIParameters: {
        resourceUrl: process.env.AZURE_OPENAI_ENDPOINT,
        deploymentId: process.env.AZURE_OPENAI_GPT_DEPLOYMENT,
        modelName: process.env.AZURE_OPENAI_GPT_DEPLOYMENT,
      },
    },
  ],
  outputMode: "answerSynthesis",
  answerInstructions:
    "Provide a two sentence concise and informative answer based on the retrieved documents.",
});

console.log(`✅ Knowledge base 'earth-knowledge-base' created successfully.`);

const knowledgeRetrievalClient = new KnowledgeRetrievalClient(
  process.env.AZURE_SEARCH_ENDPOINT,
  "earth-knowledge-base",
  credential
);

const query1 = `Why do suburban belts display larger December brightening than urban cores even though absolute light levels are higher downtown? Why is the Phoenix nighttime street grid is so sharply visible from space, whereas large stretches of the interstate between midwestern cities remain comparatively dim?`;

const retrievalRequest = {
  messages: [
    {
      role: "user",
      content: [
        {
          type: "text",
          text: query1,
        },
      ],
    },
  ],
  knowledgeSourceParams: [
    {
      kind: "searchIndex",
      knowledgeSourceName: "earth-knowledge-source",
      includeReferences: true,
      includeReferenceSourceData: true,
      alwaysQuerySource: true,
      rerankerThreshold: 2.5,
    },
  ],
  includeActivity: true,
  retrievalReasoningEffort: { kind: "low" },
};

const result = await knowledgeRetrievalClient.retrieveKnowledge(retrievalRequest);

console.log("\n📝 ANSWER:");
console.log("─".repeat(80));
if (result.response && result.response.length > 0) {
  result.response.forEach((msg) => {
    if (msg.content && msg.content.length > 0) {
      msg.content.forEach((content) => {
        if (content.type === "text" && "text" in content) {
          console.log(content.text);
        }
      });
    }
  });
}
console.log("─".repeat(80));

if (result.activity) {
  console.log("\nActivities:");
  result.activity.forEach((activity) => {
    console.log(`Activity Type: ${activity.type}`);
    console.log(JSON.stringify(activity, null, 2));
  });
}

if (result.references) {
  console.log("\nReferences:");
  result.references.forEach((reference) => {
    console.log(`Reference Type: ${reference.type}`);
    console.log(JSON.stringify(reference, null, 2));
  });
}

// Follow-up query - to demonstrate conversational context
const query2 = "How do I find lava at night?";
console.log(`\n❓ Follow-up question: ${query2}`);

const retrievalRequest2 = {
  messages: [
    {
      role: "user",
      content: [
        {
          type: "text",
          text: query2,
        },
      ],
    },
  ],
  knowledgeSourceParams: [
    {
      kind: "searchIndex",
      knowledgeSourceName: "earth-knowledge-source",
      includeReferences: true,
      includeReferenceSourceData: true,
      alwaysQuerySource: true,
      rerankerThreshold: 2.5,
    },
  ],
  includeActivity: true,
  retrievalReasoningEffort: { kind: "low" },
};

const result2 = await knowledgeRetrievalClient.retrieveKnowledge(retrievalRequest2);

console.log("\n📝 ANSWER:");
console.log("─".repeat(80));
if (result2.response && result2.response.length > 0) {
  result2.response.forEach((msg) => {
    if (msg.content && msg.content.length > 0) {
      msg.content.forEach((content) => {
        if (content.type === "text" && "text" in content) {
          console.log(content.text);
        }
      });
    }
  });
}
console.log("─".repeat(80));

if (result2.activity) {
  console.log("\nActivities:");
  result2.activity.forEach((activity) => {
    console.log(`Activity Type: ${activity.type}`);
    console.log(JSON.stringify(activity, null, 2));
  });
}

if (result2.references) {
  console.log("\nReferences:");
  result2.references.forEach((reference) => {
    console.log(`Reference Type: ${reference.type}`);
    console.log(JSON.stringify(reference, null, 2));
  });
}

console.log("\n✅ Quickstart completed successfully!");

// Clean up resources
await searchIndexClient.deleteKnowledgeBase("earth-knowledge-base");
await searchIndexClient.deleteKnowledgeSource("earth-knowledge-source");
await searchIndexClient.deleteIndex("earth_at_night");

console.log(`\n🗑️  Cleaned up resources.`);
