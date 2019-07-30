class AzureSearchClient {
    

    constructor (searchServiceHelper) {
        this.searchServiceHelper = searchServiceHelper;
    }

    async indexExistsAsync() { 
        console.log("\n Checking if index exists...");
        const endpoint = this.searchServiceHelper.getIndexExistsUrl();
        const response = await this.searchServiceHelper.request(endpoint, "GET", null);
        console.log(`The response was ${response}`);
        // Success has a few likely status codes: 200 or 204 (No Content), but accept all in 200 range...
        const exists = response.status >= 200 && response.status < 300;
        console.log(`Index exists? ${exists}`);
        return exists;
    }

    async deleteIndexAsync() {
        console.log("\n Deleting existing index...");
        const endpoint = this.searchServiceHelper.getIndexExistsUrl();
        const response = await this.searchServiceHelper.request(endpoint, "DELETE", null);
        this.searchServiceHelper.throwOnHttpError(response.status);
        return this;
    }

    async createIndexAsync(definition) {
        console.log("\n Creating index...");
        const endpoint = this.searchServiceHelper.getCreateIndexUrl();

        const response = await this.searchServiceHelper.request(endpoint, "PUT", definition);
        console.log(response);
        this.searchServiceHelper.throwOnHttpError(response.status);
        return this;
    }
}

module.exports = AzureSearchClient;
