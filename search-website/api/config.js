const CONFIG = {
    SearchIndexName: "" || process.env["SearchIndexName"],
    SearchApiKey: "" || process.env["SearchApiKey"],
    SearchServiceName: "" || process.env["SearchServiceName"] 
}
if (!CONFIG.SearchIndexName || !CONFIG.SearchApiKey || !CONFIG.SearchServiceName) throw Error("./config.js::Cognitive Services key is missing");

module.exports = { CONFIG };