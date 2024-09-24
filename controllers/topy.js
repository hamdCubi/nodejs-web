const ErrorCode = require('../utils/ErrorCode');
const { execFile } = require('child_process');
const path = require('path');
const BlogCSVModel = require('../models/CSVModels');
const BlogSimilarModel = require('../models/similarContentModels');
const axios = require("axios");
const BlogModel = require('../models/blogModel');
const BlogUniqueModel = require('../models/uniqueContentMoedels');
const {ObjectId} = require("mongodb")
const { client } = require('../utils/Database');
const pythonURL = `http://4.213.60.40:8000`
 const db = client.db("scraaptest")
const newLinksExtracted = async(pyresponse)=>{
  try {
    const normalizeUrl = (await import('normalize-url')).default

    console.log(pyresponse,normalizeUrl(pyresponse?.site_link))
    if (pyresponse) {
      const existingFile = await BlogModel.findbysiteURL(normalizeUrl(pyresponse?.site_link));
      console.log(existingFile)
      if (existingFile) {
        console.log("pehle s existsssss+++++++++++++++--",existingFile)
         await BlogModel.delete(normalizeUrl(pyresponse?.site_link)); // Assuming this deletes by user ID and siteURL
         const  csvFileId = await BlogCSVModel.deletebyRef(existingFile?._id);
        await BlogUniqueModel.delete(csvFileId?._id); // Adjust according to your schema
        await BlogSimilarModel.delete(csvFileId?._id); // Adjust according to your schema
      }

      // Add new link file
      await BlogModel.AddNewFile(pyresponse?.fileName, normalizeUrl(pyresponse?.site_link));
      return "huaa"
    }
    
  } catch (error) {
    console.log(error)
  }
}
const toextractlink = async (req, res) => {
  const {url} =req.body

    try {
      if (!url) {
        return res.status(404).send({message:"url not found"})
      }
      const { io } = require("../app");
    
      if (!io) {
          console.error("Socket.IO instance is not initialized.");
          return res.status(500).json({ message: "not connected to the server please refresh" });
      }
        console.log(`URL received from frontend: ${url}`);
        const parsedUrl = new URL(url);
        const domainPath = `${parsedUrl.hostname}${parsedUrl.pathname}`;
        const normalizeUrl = (await import('normalize-url')).default
        console.log(`Formatted URL: ${domainPath}`);
       const checkalready = await  db.collection("activities").findOne({event:"LINK_EXTRACTION",inProgress:true,"metaData.siteLink":url})
        if (checkalready) {
          return res.status(409).send({message:"Link Is already in progress"})
        }
        const pyresponse = await axios.get(`${pythonURL}/extract_blog_links/${domainPath}`)
      console.log(pyresponse?.data)
     const activityInserted=  await  db.collection("activities").insertOne({
        user:new ObjectId(req.user._id),
        event:"LINK_EXTRACTION",
        metaData:{
          siteLink:url,
        },
        timestamp:Date.now(),
        inProgress:true

      })

      
      io.emit('new-link-extraction', {
        _id:activityInserted.insertedId,
        user:new ObjectId(req.user._id),
        event:"LINK_EXTRACTION",
        metaData:{
          siteLink:url,
        },
        timestamp:Date.now(),
        inProgress:true

      });
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
  const { io } = require("../app");
  const { message, respon ,statusCode } = req.body;
  console.log(respon,message)
  const checkalready = await  db.collection("activities").findOne({event:"LINK_EXTRACTION",inProgress:true,"metaData.siteLink":respon.site_link})
  if (!checkalready) {
    return res.status(404).send({message:"no activity found"})
  }
  console.log(statusCode)
  if (statusCode === 500) {
    // Handle error status by updating the database and emitting an event
    await db.collection("activities").findOneAndUpdate(
      { _id: new ObjectId(checkalready._id) },
      {
        $set: {
          inProgress: false,
          success: false, // Set success to false when there is an error
        },
      }
    );

    
    // Emit a failure event through WebSocket
    io.emit("link-execute-error", {
      progressId: checkalready._id,
      message: "Link extraction failed due to an error.",
    });
      
   
    return res.status(500).json({ message: "Link extraction failed." });
  }
  
 await newLinksExtracted(respon)
 await db.collection("activities").findOneAndUpdate(
  {_id:new ObjectId(checkalready._id)},
  {
    $set:{
      inProgress:false
    }
  }
 )
 const GetUpdatedLinks = await BlogModel.getLinks()
 io.emit("link-execute-complete",{
  porgressId:checkalready._id,
  updatedLinks:GetUpdatedLinks
})
  res.send("done")
} catch (error) {
  console.error("Error in try-catch block:[", error);
  res.status(500).json({ error: "Internal server error",error });
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