/**
 * Add documents into Search Index
 * 
 * 
 */

const fs = require('fs');
const parse = require('csv-parser')
const { finished } = require('stream/promises');
const { SearchClient, SearchIndexClient, AzureKeyCredential } = require("@azure/search-documents");

const SEARCH_ENDPOINT = "https://YOUR-RESOURCE-NAME.search.windows.net";
const SEARCH_KEY = "YOUR-RESOURCE-KEY";

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
const insertData = async (readable) => {

    let i = 0;

    for await (const row of readable) {
        console.log(`${i++} = ${JSON.stringify(row)}`);

        const indexItem = {
            "id": row.book_id,
            "goodreads_book_id": row.goodreads_book_id,
            "best_book_id": row.best_book_id,
            "work_id": row.work_id,
            "books_count": !row.books_count ? 0 : parseInt(row.books_count),
            "isbn": row.isbn,
            "isbn13": row.isbn13,
            "authors": row.authors.split(",").map(name => name.trim()),
            "original_publication_year": !row.original_publication_year ? 0 : parseInt(row.original_publication_year),
            "original_title": row.original_title,
            "title": row.title,
            "language_code": row.language_code,
            "average_rating": !row.average_rating ? 0 : parseInt(row.average_rating),
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
    const readable = fs
        .createReadStream(csvFile)
        .pipe(parse());

    // Pipe rows to insert function
    await insertData(readable)
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
