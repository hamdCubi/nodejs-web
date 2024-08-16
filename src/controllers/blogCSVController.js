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
      const {fileName , refLinkId} = req.body;

      const PYRes = await axios.get("https://python-server-cubi.azurewebsites.net/generate_csv/"+fileName)
      
      const insert = await CSVFileModel.AddNewCSVFile(PYRes?.data?.fileName,refLinkId,fileName)
      res.send({
        message: "All recorded files were successfully saved in the database",
      });
    } catch (catchError) {
      console.error("Error in try-catch block:", catchError);
      res.status(500).json({ error: "Internal server error",catchError });
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
module.exports = {addCSVFile ,GetCSV}