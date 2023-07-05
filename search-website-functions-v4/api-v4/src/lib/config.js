const CONFIG = {
    SearchIndexName: process.env["SearchIndexName"] || "good-books",
    SearchApiQueryKey: process.env["SearchApiKey"] || "",
    SearchServiceName: process.env["SearchServiceName"] || "",
    SearchFacets: process.env["SearchFacets"] || "authors*,language_code", 
}
console.log(CONFIG);
if (!CONFIG.SearchIndexName || !CONFIG.SearchApiQueryKey || !CONFIG.SearchServiceName) throw Error("./config.js::Cognitive Services key is missing");

module.exports = { CONFIG };
