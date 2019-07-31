const fetch = require('node-fetch');

class SearchServiceHelper {
    constructor(searchServiceName, apiKey, indexName) {
        this.searchServiceName = searchServiceName;
        this.apiKey = apiKey;
        this.indexName = indexName;
        this.apiVersion = '2019-05-06';
    }

    getIndexUrl() { return `https://${this.searchServiceName}.search.windows.net/indexes/${this.indexName}?api-version=${this.apiVersion}`; }
    
    getPostDataUrl() { return `https://${this.searchServiceName}.search.windows.net/indexes/${this.indexName}/docs/index?api-version=${this.apiVersion}`;  }

    getSearchUrl(searchTerm) { return `https://${this.searchServiceName}.search.windows.net/indexes/${this.indexName}/docs?api-version=${this.apiVersion}&search=${searchTerm}&searchMode=all`; }
    
    
    request(url, method, bodyJson = null) {
        // Uncomment the following for request details:
        /*
        console.log(`\n${method} ${url}`);
        if (bodyJson !== null) {
            console.log(`\ncontent: ${JSON.stringify(bodyJson, null, 4)}`);
        }
        */

        const headers = {
            'content-type' : 'application/json',
            'api-key' : this.apiKey
        };
        const init = bodyJson === null ?
            { 
                method : method, 
                headers : headers
            }
            : 
            {
                method : method, 
                headers : headers,
                body : JSON.stringify(bodyJson)
            };
        return fetch(url, init);
    }

    throwOnHttpError(response) {
        const statusCode = response.status;
        console.log(`Response Status: ${statusCode}`);
        if (statusCode >= 300){
            console.log(`Request failed: ${JSON.stringify(response, null, 4)}`);
            throw new Exception(`Failure in request. HTTP Status was ${statusCode}`);
        }
    }
}

module.exports = SearchServiceHelper;