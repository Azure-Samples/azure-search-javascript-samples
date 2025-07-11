import {
    SearchIndexClient
} from "@azure/search-documents";
import { searchEndpoint, indexName, credential, semanticConfigurationName } from "./config.js";

try {

    const indexClient = new SearchIndexClient(searchEndpoint, credential);

    const existingIndex = await indexClient.getIndex(indexName);

    const fields = {
        titleField: {
            name: "HotelName"
        },
        keywordsFields: [{
            name: "Tags"
        }],
        contentFields: [{
            name: "Description"
        }]
    };

    const newSemanticConfiguration = {
        name: semanticConfigurationName,
        prioritizedFields: fields
    };

    // Add the new semantic configuration to the existing index
    if (existingIndex.semanticSearch && existingIndex.semanticSearch.configurations) {
        existingIndex.semanticSearch.configurations.push(newSemanticConfiguration);
    } else {
        const configExists = existingIndex.semanticSearch?.configurations?.some(
            config => config.name === semanticConfigurationName
        );
        if (!configExists) {
            existingIndex.semanticSearch = {
                configurations: [newSemanticConfiguration]
            };
        }
    }

    await indexClient.createOrUpdateIndex(existingIndex);

    const updatedIndex = await indexClient.getIndex(indexName);

    console.log(`Semantic configurations:`);
    console.log("-".repeat(40));

    if (updatedIndex.semanticSearch && updatedIndex.semanticSearch.configurations) {
        for (const config of updatedIndex.semanticSearch.configurations) {
            console.log(`Configuration name: ${config.name}`);
            console.log(`Title field: ${config.prioritizedFields.titleField?.name}`);
            console.log(`Keywords fields: ${config.prioritizedFields.keywordsFields?.map(f => f.name).join(", ")}`);
            console.log(`Content fields: ${config.prioritizedFields.contentFields?.map(f => f.name).join(", ")}`);
            console.log("-".repeat(40));
        }
    } else {
        console.log("No semantic configurations found.");
    }

    console.log("Semantic configuration updated successfully.");
} catch (error) {
    console.error("Error updating semantic configuration:", error);
}
