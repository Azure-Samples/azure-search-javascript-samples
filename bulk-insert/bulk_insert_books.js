import fetch from 'node-fetch';
import Papa from 'papaparse';
import {
  SearchClient,
  SearchIndexClient,
  AzureKeyCredential
} from '@azure/search-documents';

// Azure AI Search resource settings
const SEARCH_ENDPOINT = 'https://YOUR-RESOURCE-NAME.search.windows.net';
const SEARCH_ADMIN_KEY = 'YOUR-RESOURCE-ADMIN-KEY';

// Azure AI Search index settings
const SEARCH_INDEX_NAME = 'good-books';
import SEARCH_INDEX_SCHEMA from './good-books-index.json' assert { type: 'json' };

// Data settings
const BOOKS_URL =
  'https://raw.githubusercontent.com/Azure-Samples/azure-search-sample-data/main/good-books/books.csv';
const BATCH_SIZE = 1000;

// Create Search service client
// used to upload docs into Index
const client = new SearchClient(
  SEARCH_ENDPOINT,
  SEARCH_INDEX_NAME,
  new AzureKeyCredential(SEARCH_ADMIN_KEY)
);

// Create Search service Index client
// used to create new Index
const clientIndex = new SearchIndexClient(
  SEARCH_ENDPOINT,
  new AzureKeyCredential(SEARCH_ADMIN_KEY)
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
      id: row.book_id,
      goodreads_book_id: parseInt(row.goodreads_book_id),
      best_book_id: parseInt(row.best_book_id),
      work_id: parseInt(row.work_id),
      books_count: !row.books_count ? 0 : parseInt(row.books_count),
      isbn: row.isbn,
      isbn13: row.isbn13,
      authors: row.authors.split(',').map((name) => name.trim()),
      original_publication_year: !row.original_publication_year
        ? 0
        : parseInt(row.original_publication_year),
      original_title: row.original_title,
      title: row.title,
      language_code: row.language_code,
      average_rating: !row.average_rating ? 0 : parseFloat(row.average_rating),
      ratings_count: !row.ratings_count ? 0 : parseInt(row.ratings_count),
      work_ratings_count: !row.work_ratings_count
        ? 0
        : parseInt(row.work_ratings_count),
      work_text_reviews_count: !row.work_text_reviews_count
        ? 0
        : parseInt(row.work_text_reviews_count),
      ratings_1: !row.ratings_1 ? 0 : parseInt(row.ratings_1),
      ratings_2: !row.ratings_2 ? 0 : parseInt(row.ratings_2),
      ratings_3: !row.ratings_3 ? 0 : parseInt(row.ratings_3),
      ratings_4: !row.ratings_4 ? 0 : parseInt(row.ratings_4),
      ratings_5: !row.ratings_5 ? 0 : parseInt(row.ratings_5),
      image_url: row.image_url,
      small_image_url: row.small_image_url
    });

    console.log(`${i}`);

    // Insert batch into Index
    if (batchArray.length % BATCH_SIZE === 0) {
      await client.uploadDocuments(batchArray);

      console.log(`BATCH SENT`);
      batchArray = [];
    }
  }
  // Insert any final batch into Index
  if (batchArray.length > 0) {
    await client.uploadDocuments(batchArray);

    console.log(`FINAL BATCH SENT`);
    batchArray = [];
  }
};
const bulkInsert = async () => {
  // Download CSV Data file
  const response = await fetch(BOOKS_URL, {
    method: 'GET'
  });
  if (response.ok) {
    console.log(`book list fetched`);
    const fileData = await response.text();
    console.log(`book list data received`);

    // convert CSV to JSON
    const dataObj = Papa.parse(fileData, {
      header: true,
      encoding: 'utf8',
      skipEmptyLines: true
    });
    console.log(`book list data parsed`);

    // Insert JSON into Search Index
    await insertData(dataObj.data);
    console.log(`book list data inserted`);
  } else {
    console.log(`Couldn\t download data`);
  }
};

// Create Search Index
async function createIndex() {
  SEARCH_INDEX_SCHEMA.name = SEARCH_INDEX_NAME;

  const result = await clientIndex.createIndex(SEARCH_INDEX_SCHEMA);
}

await createIndex();
console.log('index created');

await bulkInsert();
console.log('data inserted into index');
