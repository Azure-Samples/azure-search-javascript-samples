/**
 * Add documents into Search Index
 * 
 * 1. Download the `books.csv` from https://raw.githubusercontent.com/zygmuntz/goodbooks-10k/master/books.csv to this same directory before running this script.
 * 2. Edit the values for SEARCH_ENDPOINT and SEARCH_KEY for your own Search resource.
 * 3. Script creates a new index called `good-books` in your Search resource. 
 */

const fs = require('fs').promises;
const Papa = require('papaparse')
const { SearchClient, SearchIndexClient, AzureKeyCredential } = require("@azure/search-documents");

const SEARCH_ENDPOINT = "https://my-search-resource-diberry.search.windows.net";
const SEARCH_KEY = "E0E3F39AB9E211C452205D3922773A1C";

const SEARCH_INDEX_NAME = "good-books";
const csvFile = './books.csv'
const schema = require("./good-books-index.json");

const client = new SearchClient(
    SEARCH_ENDPOINT,
    SEARCH_INDEX_NAME,
    new AzureKeyCredential(SEARCH_KEY)
);
const clientIndex = new SearchIndexClient(
    SEARCH_ENDPOINT,
    new AzureKeyCredential(SEARCH_KEY)
);


// insert each row into ...
const insertData = async (data) => {

    console.log(`length = ${data.length}`);
    
    for (let i = 0; i < data.length; i++) {
        
        const row = data[i];
        
        console.log(`${i} = ${JSON.stringify(row)}`);
       
        const indexItem = {
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
        }


        const uploadResult = await client.uploadDocuments([indexItem]);
    }

}
const bulkInsert = async () => {


    // read file, parse CSV, each row is a chunk
    const fileData = await fs
        .readFile(csvFile, {encoding:'utf8' });

    // convert text to array
    const dataObj = Papa.parse(fileData, {
        header: true,
        encoding: 'utf8',
        skipEmptyLines: true,
    })
    
    // Pipe rows to insert function
    await insertData(dataObj.data)
}
async function createIndex() {

    schema.name = SEARCH_INDEX_NAME;
    const result = await clientIndex.createIndex(schema);

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
