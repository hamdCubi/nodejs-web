const ErrorCode = require('../utils/ErrorCode');
const { execFile } = require('child_process');
const path = require('path');
const BlogUniqueModel = require('../models/uniqueContentMoedels');
const BlogCSVModel = require('../models/CSVModels');
const axios = require('axios');

const ADDUniqueFileCallBack = async()=>{

}
const addUniqueFile = async (req, res) => {
    try {
      
      const {BasefileName,SourcefileName,baseFileId,sourceFileId,} = req.body;

        // check file already exist

      const check = await BlogUniqueModel.CheckByBaseSorce(baseFileId,sourceFileId)
      if (check) {
        console.log("already exist")
      const theJSONDataU = await axios.get(`http://4.213.60.40:8000/uniqueFolder/${check?.content}`);
     
      res.send(
       { JSONIS:theJSONDataU?.data,
          time:check.timestamp
       });
      return 
      }

      const ressponse = await axios.get(`http://4.213.60.40:8000/unique_content/${BasefileName}/${SourcefileName}`);
      console.log(ressponse.data)
      const theJSONDataU = await axios.get(`http://4.213.60.40:8000/uniqueFolder/${ressponse?.data?.JSON_FileName}`);
console.log(theJSONDataU)

      const insert = await BlogUniqueModel.AddNewUniqueFile(baseFileId,sourceFileId,ressponse?.data?.JSON_FileName)
      res.send({
        JSONIS:theJSONDataU?.data,
        time:Date.now()
      });
    } catch (catchError) {
      console.error("Error in try-catch block:", catchError);
      res.status(500).json({ error: "Internal server error",catchError });
    }
  };
  const WebHooksUnique = async()=>{}
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

  const getautoUnique = async (req,res)=>{
    try {
      const getCSV = await BlogUniqueModel.getUniqueByName()
      console.log(getCSV[0].content)
      const theJSONDataU = await axios.get(`http://4.213.60.40:8000/uniqueFolder/${getCSV[0]?.content}`);
      res.send({
        message: "All recorded files CSV",
        theJSON:theJSONDataU?.data
      });
      
    } catch (error) {
      console.log(error)
      res.status(500).send(error)
    }
  }
module.exports = {addUniqueFile ,GetCSV , getautoUnique}