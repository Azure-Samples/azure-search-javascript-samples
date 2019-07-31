class AzureSearchClient {
    constructor (searchServiceHelper) {
        this.searchServiceHelper = searchServiceHelper;
    }

    async indexExistsAsync() { 
        console.log("\n Checking if index exists...");
        const endpoint = this.searchServiceHelper.getIndexUrl();
        const response = await this.searchServiceHelper.request(endpoint, "GET", null);
        // Success has a few likely status codes: 200 or 204 (No Content), but accept all in 200 range...
        const exists = response.status >= 200 && response.status < 300;
        return exists;
    }

    async deleteIndexAsync() {
        console.log("\n Deleting existing index...");
        const endpoint = this.searchServiceHelper.getIndexUrl();
        const response = await this.searchServiceHelper.request(endpoint, "DELETE");
        this.searchServiceHelper.throwOnHttpError(response);
        return this;
    }

    async createIndexAsync(definition) {
        console.log("\n Creating index...");
        const endpoint = this.searchServiceHelper.getIndexUrl();
        const response = await this.searchServiceHelper.request(endpoint, "PUT", definition);
        this.searchServiceHelper.throwOnHttpError(response);
        return this;
    }

    async postDataAsync(hotelsData) {
        console.log("\n Adding hotel data...");
        const endpoint = this.searchServiceHelper.getPostDataUrl();
        const response = await this.searchServiceHelper.request(endpoint,"POST", hotelsData);
        this.searchServiceHelper.throwOnHttpError(response);
        return this;
    }

    async queryAsync(searchTerm) {
        console.log("\n Querying...")
        const endpoint = this.searchServiceHelper.getSearchUrl(searchTerm);
        const response = await this.searchServiceHelper.request(endpoint, "GET");
        this.searchServiceHelper.throwOnHttpError(response);
        return response;
    }
}

module.exports = AzureSearchClient;
