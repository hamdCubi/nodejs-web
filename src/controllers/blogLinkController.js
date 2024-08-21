const ErrorCode = require('../utils/ErrorCode');
const { execFile } = require('child_process');
const path = require('path');
const BlogModel = require('../models/blogModel');
const BlogCSVModel = require('../models/CSVModels');
const BlogUniqueModel = require('../models/uniqueContentMoedels');
const BlogSimilarModel = require('../models/similarContentModels');

const addLinkFile = async (req, res) => {
  try {
    if (req.user.role != "admin") {
      return res.status(401).send("only admin can perform this")
    }
    const normalizeUrl = (await import('normalize-url')).default
    const linksData = req.body;

    // Check if linksData is an array
    if (!Array.isArray(linksData)) {
      return res.status(400).send({
        message: "Invalid input, expected an array of link data",
      });
    }

    const insertPromises = linksData.map(async (linkData) => {
      try {
        // Check if the siteURL already exists for the user
        console.log(linkData)
        const existingFile = await BlogModel.findbysiteURL(normalizeUrl(linkData.siteURL));

        // If file with same siteURL exists, delete and clean up related documents
        if (existingFile) {
          console.log("pehle s existsssss+++++++++++++++--",existingFile)
           await BlogModel.delete(normalizeUrl(linkData.siteURL)); // Assuming this deletes by user ID and siteURL
           const  csvFileId = await BlogCSVModel.deletebyRef(existingFile._id);
          await BlogUniqueModel.delete(csvFileId?._id); // Adjust according to your schema
          await BlogSimilarModel.delete(csvFileId?._id); // Adjust according to your schema
        }

        // Add new link file
        await BlogModel.AddNewFile(linkData.fileName, normalizeUrl(linkData.siteURL));
      } catch (error) {
        console.error("Error processing linkData:", error);
        return false; // Indicate failure
      }
    });

    const insertResults = await Promise.all(insertPromises);

    // Check if any insert operation failed
    const failedInserts = insertResults.filter((insert) => !insert);
    

    res.send({
      message: "All recorded files were successfully saved in the database",
    });
  } catch (error) {
    console.error("Error in try-catch block:", error.message);
    res.status(500).json({ error: "Internal server error", message: error.message });
  }
};

  const GetLinks = async (req, res) => {
    try {
      if (req.user.role != "admin") {
        return res.status(401).send("only admin can perform this")
      }
  
     const getlinks = await BlogModel.getLinks()
     console.log(BlogModel.getLinks)
      res.send({
        message: "All recorded files were successfully saved in the database",
        links:getlinks
      });
    } catch (catchError) {
      console.error("Error in try-catch block:", catchError.message);
      res.status(500).json({ error: "Internal server error",catchError });
    }
  };
module.exports = {addLinkFile ,GetLinks}