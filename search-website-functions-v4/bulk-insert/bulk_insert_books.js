/**
 * Add documents into Search Index
 * Script creates a new index called `good-books` in your Search resource.
 * 
 * 1. Edit the values for your own Search resource.
 *     * YOUR-SEARCH-RESOURCE-NAME
 *     * YOUR-SEARCH-ADMIN-KEY
 * 2. Run script with `npm install && npm start`
 *  
 */

const axios = require('axios');
const Papa = require('papaparse')
const { SearchClient, SearchIndexClient, AzureKeyCredential } = require("@azure/search-documents");

const SEARCH_ENDPOINT = "https://YOUR-SEARCH-RESOURCE-NAME.search.windows.net";
const SEARCH_KEY = "YOUR-SEARCH-ADMIN-KEY";

const SEARCH_INDEX_NAME = "good-books";
const SEARCH_INDEX_SCHEMA = require("./good-books-index.json");

const BOOKS_URL = "https://raw.githubusercontent.com/heidisdteen/goodbooks-10k/master/books.csv";
const BATCH_SIZE = 1000;

// Create Search service client
// used to upload docs into Index
const client = new SearchClient(
    SEARCH_ENDPOINT,
    SEARCH_INDEX_NAME,
    new AzureKeyCredential(SEARCH_KEY)
);

// Create Search service Index client
// used to create new Index
const clientIndex = new SearchIndexClient(
    SEARCH_ENDPOINT,
    new AzureKeyCredential(SEARCH_KEY)
);

// Insert docs into Search Index
// in batch
const insertData = async (data) => {

    let batch = 0;
    let batchArray = [];
    
    for (let i = 0; i < data.length; i++) {
        
        const row = data[i];
       
        // Convert string data to typed data
        // Types are defined in schema
        batchArray.push({
            "id": row.book_id,
            "goodreads_book_id": parseInt(row.goodreads_book_id),
            "best_book_id": parseInt(row.best_book_id),
            "work_id": parseInt(row.work_id),
            "books_count": !row.books_count ? 0 : parseInt(row.books_count),
            "isbn": row.isbn,
            "isbn13": row.isbn13,
            "authors": row.authors.split(",").map(name => name.trim()),
            "original_publication_year": !row.original_publication_year ? 0 : parseInt(row.original_publication_year),
            "original_title": row.original_title,
            "title": row.title,
            "language_code": row.language_code,
            "average_rating": !row.average_rating ? 0 : parseFloat(row.average_rating),
            "ratings_count": !row.ratings_count ? 0 : parseInt(row.ratings_count),
            "work_ratings_count": !row.work_ratings_count ? 0 : parseInt(row.work_ratings_count),
            "work_text_reviews_count": !row.work_text_reviews_count ? 0 : parseInt(row.work_text_reviews_count),
            "ratings_1": !row.ratings_1 ? 0 : parseInt(row.ratings_1),
            "ratings_2": !row.ratings_2 ? 0 : parseInt(row.ratings_2),
            "ratings_3": !row.ratings_3 ? 0 : parseInt(row.ratings_3),
            "ratings_4": !row.ratings_4 ? 0 : parseInt(row.ratings_4),
            "ratings_5": !row.ratings_5 ? 0 : parseInt(row.ratings_5),
            "image_url": row.image_url,
            "small_image_url": row.small_image_url
        })
        
        console.log(`${i}`);
        
        // Insert batch into Index
        if ((batchArray.length % BATCH_SIZE) === 0){
            await client.uploadDocuments(batchArray);
            
            console.log(`BATCH SENT`);
            batchArray = [];
        }
        
    }
    // Insert any final batch into Index
    if (batchArray.length > 0 ){
        await client.uploadDocuments(batchArray);
        
        console.log(`FINAL BATCH SENT`);
        batchArray = [];
    }
}
const bulkInsert = async () => {

    // Download CSV Data file
    const response = await axios.get(BOOKS_URL);
    const fileData = response.data;

    // convert CSV to JSON
    const dataObj = Papa.parse(fileData, {
        header: true,
        encoding: 'utf8',
        skipEmptyLines: true,
    })
    
    // Insert JSON into Search Index
    await insertData(dataObj.data)
}

// Create Search Index
async function createIndex() {

    SEARCH_INDEX_SCHEMA.name = SEARCH_INDEX_NAME;
    const result = await clientIndex.createIndex(SEARCH_INDEX_SCHEMA);

    console.log(result);
}

const main = async () => {

    await createIndex();
    console.log("index created");

    await bulkInsert();
}

main()
.then(() => console.log('done'))
.catch((err) => {
    console.log(`done +  failed ${err}`)
});
