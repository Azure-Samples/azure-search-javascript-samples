const CONFIG = {
    SearchIndexName: process.env["SearchIndexName"] || "good-books",
    SearchApiKey: process.env["SearchApiKey"] || "0DD93422395CE836EF53349EF9AAA700",
    SearchServiceName: process.env["SearchServiceName"] || "diberry-cog-search-js",
    SearchFacets: process.env["SearchFacets"] || "authors*,language_code", 
}
if (!CONFIG.SearchIndexName || !CONFIG.SearchApiKey || !CONFIG.SearchServiceName) throw Error("./config.js::Cognitive Services key is missing");

module.exports = { CONFIG };