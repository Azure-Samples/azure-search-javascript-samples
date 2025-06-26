import {
    createIndex,
    uploadDocuments,
    deleteIndex
} from './manageIndex.js';
import {
    singleVectorSearch,
    singleVectorSearchWithFilter,
    vectorQueryWithGeoFilter,
    hybridSearch,
    semanticHybridSearch,
} from './search.js';

async function main(): Promise<void> {
    try {

        const searchIndexClient = await createIndex();
        await uploadDocuments();

        await singleVectorSearch();
        await singleVectorSearchWithFilter();
        await vectorQueryWithGeoFilter();
        await hybridSearch();
        await semanticHybridSearch();

        await deleteIndex(searchIndexClient);
    } catch (error) {
        console.error("Error:", error);
    }
}

main().catch((error) => {
    console.error("An error occurred in the main function:", error);
});
