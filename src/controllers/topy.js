const ErrorCode = require('../utils/ErrorCode');
const { execFile } = require('child_process');
const path = require('path');
const BlogCSVModel = require('../models/CSVModels');
const BlogSimilarModel = require('../models/similarContentModels');
const axios = require("axios");
const BlogModel = require('../models/blogModel');
const BlogUniqueModel = require('../models/uniqueContentMoedels');
const newLinksExtracted = async(pyresponse)=>{
  try {
    if (pyresponse?.data) {
      const existingFile = await BlogModel.findbysiteURL(normalizeUrl(pyresponse?.data?.respon?.site_link));
      if (existingFile) {
        console.log("pehle s existsssss+++++++++++++++--",existingFile)
         await BlogModel.delete(normalizeUrl(pyresponse?.data?.respon?.site_link)); // Assuming this deletes by user ID and siteURL
         const  csvFileId = await BlogCSVModel.deletebyRef(existingFile?._id);
        await BlogUniqueModel.delete(csvFileId?._id); // Adjust according to your schema
        await BlogSimilarModel.delete(csvFileId?._id); // Adjust according to your schema
      }

      // Add new link file
      await BlogModel.AddNewFile(pyresponse?.data?.respon?.fileName, normalizeUrl(pyresponse?.data?.respon?.site_link));
    }
    
  } catch (error) {
    return error
  }
}
const toextractlink = async (req, res) => {
    try {
        const {url} =req.body
        console.log(`URL received from frontend: ${url}`);
        const parsedUrl = new URL(url);
        const domainPath = `${parsedUrl.hostname}${parsedUrl.pathname}`;
        const normalizeUrl = (await import('normalize-url')).default
        console.log(`Formatted URL: ${domainPath}`);

        const pyresponse = await axios.get(`https://python-server-cubi.azurewebsites.net/extract_blog_links/${domainPath}`)
      console.log(pyresponse?.data)
      // newLinksExtracted(pyresponse)
        res.send({
          message:"Links execution is started",
        })
    } catch (catchError) {
      console.error("Error in try-catch block:[", catchError);
      res.status(500).json({ error: "Internal server error",catchError });
    }
  };

  const WEBHOOKLINKEXT =async(req,res)=>{
try {
  const { message, respon } = req.body;
  newLinksExtracted(respon?.data)
  res.send("done")
} catch (error) {
  console.error("Error in try-catch block:[", catchError);
  res.status(500).json({ error: "Internal server error",catchError });
}
  }
 
  const togetcsv= async (req, res) => {
    try {
    
    } catch (catchError) {
      console.error("Error in try-catch block:", catchError.message);
      res.status(500).json({ error: "Internal server error",catchError });
    }
  };
  
  const togetsimilar= async (req, res) => {
    try {
    
    } catch (catchError) {
      console.error("Error in try-catch block:", catchError.message);
      res.status(500).json({ error: "Internal server error",catchError });
    }
  };
 
module.exports = {toextractlink ,togetcsv,togetsimilar , WEBHOOKLINKEXT}