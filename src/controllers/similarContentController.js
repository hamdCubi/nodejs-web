const ErrorCode = require('../utils/ErrorCode');
const { execFile } = require('child_process');
const path = require('path');
const BlogCSVModel = require('../models/CSVModels');
const BlogSimilarModel = require('../models/similarContentModels');
const axios = require("axios")
const addsimilarFile = async (req, res) => {
    try {
      const {BasefileName,similarTital} = req.body; 



      const ressponse = await axios.get(`https://python-server-cubi.azurewebsites.net/similar_content/${BasefileName}/${similarTital}`);

      console.log(ressponse.data)
      res.send(ressponse?.data);
    } catch (catchError) {
      console.error("Error in try-catch block:", catchError.message);
      res.status(500).json({ error: "Internal server error",catchError });
    }
  };
  const GetSimilars = async (req, res) => {
    try {
      
  
     const getCSV = await BlogSimilarModel.getSimilar()
      res.send({
        message: "All recorded files CSV",
        CSV:getCSV
      });
    } catch (catchError) {
      console.error("Error in try-catch block:", catchError.message);
      res.status(500).json({ error: "Internal server error",catchError });
    }
  };
module.exports = {addsimilarFile ,GetSimilars}