const fetch = require('node-fetch');

class AzureSearchClient {
    constructor(searchServiceName, apiKey, indexName) {
        this.searchServiceName = searchServiceName;
        this.apiKey = apiKey;
        this.indexName = indexName;
        this.apiVersion = '2019-05-06';
    }

    getIndexUrl() { return `https://${this.searchServiceName}.search.windows.net/indexes/${this.indexName}?api-version=${this.apiVersion}`; }
    
    getPostDataUrl() { return `https://${this.searchServiceName}.search.windows.net/indexes/${this.indexName}/docs/index?api-version=${this.apiVersion}`;  }

    getSearchUrl(searchTerm) { return `https://${this.searchServiceName}.search.windows.net/indexes/${this.indexName}/docs?api-version=${this.apiVersion}&search=${searchTerm}&searchMode=all`; }
    
    static request(url, method, apiKey, bodyJson = null) {
        // Uncomment the following for request details:
        /*
        console.log(`\n${method} ${url}`);
        if (bodyJson !== null) {
            console.log(`\ncontent: ${JSON.stringify(bodyJson, null, 4)}`);
        }
        */

        const headers = {
            'content-type' : 'application/json',
            'api-key' : apiKey
        };
        const init = bodyJson === null ?
            { 
                method, 
                headers
            }
            : 
            {
                method, 
                headers,
                body : JSON.stringify(bodyJson)
            };
        return fetch(url, init);
    }

    static throwOnHttpError(response) {
        const statusCode = response.status;
        console.log(`Response Status: ${statusCode}`);
        if (statusCode >= 300){
            console.log(`Request failed: ${JSON.stringify(response, null, 4)}`);
            throw new Error(`Failure in request. HTTP Status was ${statusCode}`);
        }
    }

    async indexExistsAsync() { 
        console.log("\n Checking if index exists...");
        const endpoint = this.getIndexUrl();
        const response = await this.request(endpoint, "GET", this.apiKey);
        // Success has a few likely status codes: 200 or 204 (No Content), but accept all in 200 range...
        const exists = response.status >= 200 && response.status < 300;
        return exists;
    }

    async deleteIndexAsync() {
        console.log("\n Deleting existing index...");
        const endpoint = this.getIndexUrl();
        const response = await this.request(endpoint, "DELETE", this.apiKey);
        this.throwOnHttpError(response);
        return this;
    }

    async createIndexAsync(definition) {
        console.log("\n Creating index...");
        const endpoint = this.getIndexUrl();
        const response = await this.request(endpoint, "PUT", this.apiKey, definition);
        this.throwOnHttpError(response);
        return this;
    }

    async postDataAsync(hotelsData) {
        console.log("\n Adding hotel data...");
        const endpoint = this.getPostDataUrl();
        const response = await this.request(endpoint,"POST", this.apiKey, hotelsData);
        this.throwOnHttpError(response);
        return this;
    }

    async queryAsync(searchTerm) {
        console.log("\n Querying...")
        const endpoint = this.getSearchUrl(searchTerm);
        const response = await this.request(endpoint, "GET", this.apiKey);
        this.throwOnHttpError(response);
        return response;
    }
}

module.exports = AzureSearchClient;
