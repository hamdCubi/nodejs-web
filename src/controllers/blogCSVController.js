const ErrorCode = require('../utils/ErrorCode');
const { execFile } = require('child_process');
const path = require('path');
const CSVFileModel = require('../models/CSVModels');
const { default: axios } = require('axios');
const {ObjectId} = require("mongodb")
const { client } = require('../utils/Database');
const db = client.db("scraaptest")
const pythonURL = `http://4.213.60.40:8000`
const addCSVFile = async (req, res) => {
  try {
      if (req.user.role != "admin") {
          return res.status(401).send({message:"only admin can perform this"})
      }
      console.log(req.body)
      const { fileName, refLinkId , siteLink } = req.body;
      const { io } = require("../app");
    
      if (!io) {
          console.error("Socket.IO instance is not initialized.");
          return res.status(500).json({ message: "not connected to the server please refresh" });
      }
      const CheckIFCSVExist = await db.collection("csvfiles").findOne({
        refLinksFile:new ObjectId(refLinkId)})
        if (CheckIFCSVExist) {
          return res.status(400).send({message:"csv for this site is already genrated"})
        }
      const checkalready = await  db.collection("activities").findOne(
        {event:"CSV_EXTRACTION",inProgress:true,"metaData.refLinkId":new ObjectId(refLinkId)})
      if (checkalready) {
        return res.status(409).send({message:"Link Is already in progress"})
      }
      // Construct the URL with query parameters
      const PYRes = await axios.get(`${pythonURL}/generate_csv/${fileName}?refLinkId=${refLinkId}`);
      const activityInserted=  await  db.collection("activities").insertOne({
        user:new ObjectId(req.user._id),
        event:"CSV_EXTRACTION",
        metaData:{
          refLinkId:new ObjectId(refLinkId),
          fileName,
          siteLink
        },
        timestamp:Date.now(),
        inProgress:true

      })

      
      io.emit('new-CSV-extraction',{
        user:new ObjectId(req.user._id),
        event:"CSV_EXTRACTION",
        metaData:{
          refLinkId:new ObjectId(refLinkId),
          fileName,
          siteLink

        },
        timestamp:Date.now(),
        inProgress:true

      });
      res.send({
          message: "Scraping process started.........",
      });
  } catch (catchError) {
      console.error("Error in try-catch block:", catchError);
      res.status(500).json({ error: "Internal server error", catchError });
  }
};


const WEEBHOOKCSVGENRATE = async (req, res) => {
  const { io } = require("../app");
  
  const { fileName, refLinkId, refFileName } = req.body;

  const checkalready = await  db.collection("activities").findOne(
    {event:"CSV_EXTRACTION",inProgress:true,"metaData.refLinkId":new ObjectId(refLinkId)})
  try {
    await db.collection("activities").findOneAndUpdate(
      {_id:new ObjectId(checkalready._id)},
      {
        $set:{
          inProgress:false
        }
      }
     )
  if (!checkalready) {
    return res.status(404).send({message:"no activity found"})
  }
  const insert = await CSVFileModel.AddNewCSVFile(fileName, refLinkId, refFileName);
  if (!insert) {
    io.emit("CSV-execute-error", {
      progressId: checkalready._id,
      message: "Link extraction completed but faild to save in db.",
    });
    return res.status(500).send("Failed to insert the CSV file information.");
  }
  const getCSV = await CSVFileModel.getCSVS()
console.log(getCSV)
  io.emit("CSV-execute-complete",{
    porgressId:checkalready._id,
    updatedCSV:getCSV
  })
    // Assuming CSVFileModel.AddNewCSVFile is an asynchronous function that saves the data in your database
   

    // Check if the insertion was successful (assuming it returns something)
    
  } catch (error) {
    io.emit("CSV-execute-error", {
      progressId: checkalready._id,
      message: "Link extraction failed due to an error.",
    });
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