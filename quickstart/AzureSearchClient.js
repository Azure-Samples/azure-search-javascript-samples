class AzureSearchClient {
    

    constructor (searchServiceHelper) {
        this.searchServiceHelper = searchServiceHelper;
    }

    indexExists() { 
        console.log("\n Checking if index exists...");
        const endpoint = this.searchServiceHelper.getIndexExistsUrl();
        this.searchServiceHelper.request(endpoint, "GET", null)
        .then((response) => {
            return response.status == 200;
        });
    }

    createIndex(definition) {
        console.log("\n Creating index...");
        const endpoint = this.searchServiceHelper.getCreateIndexUrl();

        this.searchServiceHelper.request(endpoint, "PUT", definition)
        .then((response) => {
            console.log(response);
            this.searchServiceHelper.throwOnHttpError(response.status);
        });

    }
}

module.exports = AzureSearchClient;
