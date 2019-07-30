const fetch = require('node-fetch');

class SearchServiceHelper {
    constructor(searchServiceName, apiKey, indexName) {
        this.searchServiceName = searchServiceName;
        this.apiKey = apiKey;
        this.indexName = indexName;
        this.apiVersion = '2019-05-06';
        console.log(`${searchServiceName} | ${this.searchServiceName}`);
    }

    _indexUrl() { return `https://${this.searchServiceName}.search.windows.net/indexes/${this.indexName}?api-version=${this.apiVersion}`; }
    
    getIndexExistsUrl() { return this._indexUrl(); }
	getCreateIndexUrl() { return this._indexUrl(); }

    getSearchURL(searchTerm) { return `https://${this.searchServiceName}.search.windows.net/indexes/${this.indexName}/docs?api-version=${this.apiVersion}&search=${searchTerm}&searchMode=all`; }
    
    
    request(url, method, bodyContent = null) {
        const headers = {
            'content-type' : 'application/json',
            'api-key' : this.apiKey,
            'proxy' : 'http://127.0.0.1:8888'
        };
        const init = bodyContent === null ?
            { 
                method : method, 
                headers : headers
            }
            : 
            {
                method : method, 
                headers : headers,
                body : JSON.stringify(bodyContent)
            };
        console.log(url);
        console.log(`init = ${init.body}`)
        return fetch(url, init);
    }

    throwOnHttpError(statusCode) {
        if (statusCode >= 500){
            console.log(`Request returned error code ${statusCode}`);
            throw new UserException(`Failure in request. HTTP Status was ${statusCode}`);
        }
    }
}

module.exports = SearchServiceHelper;