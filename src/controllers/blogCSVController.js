const ErrorCode = require('../utils/ErrorCode');
const { execFile } = require('child_process');
const path = require('path');
const CSVFileModel = require('../models/CSVModels');
const { default: axios } = require('axios');

const addCSVFile = async (req, res) => {
  try {
      if (req.user.role != "admin") {
          return res.status(401).send("only admin can perform this")
      }
      console.log(req.body)
      const { fileName, refLinkId } = req.body;

      // Construct the URL with query parameters
      const PYRes = await axios.get(`https://python-server-cubi.azurewebsites.net/generate_csv/${fileName}?refLinkId=${refLinkId}`);

      res.send({
          message: "Scraping process started.........",
      });
  } catch (catchError) {
      console.error("Error in try-catch block:", catchError);
      res.status(500).json({ error: "Internal server error", catchError });
  }
};


const WEEBHOOKCSVGENRATE = async (req, res) => {
  console.log(req.body)
  try {
    const { fileName, refLinkId, refFileName } = req.body;
    

    // Assuming CSVFileModel.AddNewCSVFile is an asynchronous function that saves the data in your database
    const insert = await CSVFileModel.AddNewCSVFile(fileName, refLinkId, refFileName);

    // Check if the insertion was successful (assuming it returns something)
    if (insert) {
      res.send("CSV generated and data inserted successfully.");
    } else {
      res.status(500).send("Failed to insert the CSV file information.");
    }
  } catch (error) {
    console.error("Error handling the webhook:", error);
    res.status(500).send("An error occurred while processing the request.");
  }
};

  const GetCSV = async (req, res) => {
    try {
      
  
     const getCSV = await CSVFileModel.getCSVS()
      res.send({
        message: "All recorded files CSV",
        CSV:getCSV
      });
    } catch (catchError) {
      console.error("Error in try-catch block:", catchError.message);
      res.status(500).json({ error: "Internal server error",catchError });
    }
  };
module.exports = {addCSVFile ,GetCSV ,WEEBHOOKCSVGENRATE}