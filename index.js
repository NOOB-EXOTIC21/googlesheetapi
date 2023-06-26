const express = require('express');
const { google } = require('googleapis');

const http = require('http');
const app = express();

var requestListener = function (req, res) {
  res.writeHead(200);
  res.end('Hello, World!');
};




// Load credentials from the JSON key file you downloaded from the Google Cloud Console
const credentials = require('./ced.json');

// Set the ID of the Google Sheet
const spreadsheetId = '1MQncWCVFdvdDV0cFwqTnkYMbXN0403n6APv923PBhDo';

// Set the range of the sheet you want to retrieve data from
const range = 'index';

async function getSheetData() {
  // Create a new instance of the Sheets API
  const sheets = google.sheets('v4');

  // Authorize the client with credentials
  const auth = new google.auth.GoogleAuth({
    credentials,
    scopes: ['https://www.googleapis.com/auth/spreadsheets.readonly'],
  });
  const client = await auth.getClient();

  // Retrieve the data from the Google Sheet
  const response = await sheets.spreadsheets.values.get({
    auth: client,
    spreadsheetId,
    range,
  });

  // Extract the values from the response
  const values = response.data.values;

  // Get the header row
  const headers = values[0];

  // Remove the header row from the values array
  const dataRows = values.slice(1);

  // Convert the values to JSON format
  const jsonData = dataRows.map(row => {
    const item = {};
    headers.forEach((header, index) => {
      item[header] = row[index];
    });
    return item;
  });

  return jsonData;
}

app.get('/', (req, res) => {
  getSheetData()
    .then(jsonData => {
      res.json(jsonData);
    })
    .catch(error => {
      console.error('Error:', error);
      res.status(500).json({ error: 'An error occurred' });
    });
});
//Keep alive 
var http2 = require('https');

setInterval(function() {

  http2.get('https://bollywood.herokuapp.com');

  console.log("I'm Alive hehe");

}, 300000);
