const ErrorCode = require('../utils/ErrorCode');
const { execFile } = require('child_process');
const path = require('path');
const BlogUniqueModel = require('../models/uniqueContentMoedels');
const BlogCSVModel = require('../models/CSVModels');
const axios = require('axios');
const pythonURL =`http://4.213.60.40:8000`
const { client } = require('../utils/Database');
const db = client.db("scraaptest")
const {ObjectId} = require("mongodb")
const ADDUniqueFileCallBack = async()=>{

}
const addUniqueFile = async (req, res) => {
    try {
      const { io } = require("../app");
      const {BasefileName,SourcefileName,baseFileId,sourceFileId , generateAgain} = req.body;
      console.log({BasefileName,SourcefileName,baseFileId,sourceFileId} )
        // check file already exist
        if (!generateAgain) {
          
      const check = await BlogUniqueModel.CheckByBaseSorce(baseFileId,sourceFileId)
      console.log(check)
      if (check) {
        console.log("already exist")
      const theJSONDataU = await axios.get(`${pythonURL}/uniqueFolder/${check?.content}`);
     console.log("done")
     console.log(theJSONDataU)

      res.send(
       { JSONIS:theJSONDataU?.data,
          time:check.timestamp,
          csv: check?.csv || check?.content?.split(".")[0]+".csv"
       });
      return 
      }
    }
      // const checkalready = await  db.collection("activities").findOne({event:"UNQIUE_COMPARISON",inProgress:true,"metaData.BasefileName":BasefileName})
      // if (checkalready) {
      //   return res.status(400).send({message:"its already in process try later"})
      // }
      const ressponse = await axios.get(`${pythonURL}/unique_content/${BasefileName}/${SourcefileName}`);
      
      // const theJSONDataU = await axios.get(`${pythonURL}/uniqueFolder/${ressponse?.data?.json_filename}`);
      // console.log(theJSONDataU)
      const deletebybasesoruce = await BlogUniqueModel.DeleteByBaseSorce(baseFileId,sourceFileId)
      const insert = await BlogUniqueModel.AddNewUniqueFile(baseFileId,sourceFileId,ressponse?.data?.json_filename,ressponse?.data?.csv_filename)
      const activityInserted=  await  db.collection("activities").insertOne({
        user:new ObjectId(req.user._id),
        event:"UNQIUE_COMPARISON",
        metaData:{
          msg:"comparing....",
          filename:ressponse?.data?.json_filename,
          BasefileName,
        },
        timestamp:Date.now(),
        inProgress:true

      })

      
      io.emit('data-comparison', {
        _id:activityInserted.insertedId,
        user:new ObjectId(req.user._id),
        event:"UNQIUE_COMPARISON",
        metaData:{
          msg:"comparing....",
          filename:ressponse?.data?.json_filename,
        },
        timestamp:Date.now(),
        inProgress:true

      });
      res.send({
        // JSONIS:theJSONDataU?.data,
        csv:ressponse?.data?.csv_filename,
        time:Date.now()
      });
    } catch (catchError) {
      console.error("Error in try-catch block:", catchError);
      res.status(500).json({ error: "Internal server error",catchError });
    }
  };
  const WebHooksUnique = async(req,res)=>{
    try {
      const { io } = require("../app");
      const {json_filename ,csv_filename ,complete} = req.body;
      console.log(csv_filename,json_filename)
      const checkalready = await  db.collection("activities").findOne({event:"UNQIUE_COMPARISON",inProgress:true,"metaData.filename":json_filename})
      if (!checkalready) {
        return res.status(404).send({message:"no activity found"})
      }
      console.log(complete)
      if (!complete) {
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
        io.emit("data-comparison-error", {
          progressId: checkalready._id,
          message: "Link extraction failed due to an error.",
        });
          
       
        return res.status(500).json({ message: "Link extraction failed." });
      }
      
     
     await db.collection("activities").findOneAndUpdate(
      {_id:new ObjectId(checkalready._id)},
      {
        $set:{
          inProgress:false
        }
      }
     )
     io.emit("data-comparison-complete",{
      porgressId:checkalready._id,
    })
      res.send("done")
    } catch (error) {
      console.error("Error in try-catch block:[", error);
      res.status(500).json({ error: "Internal server error",error });
    }
  }
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
      const theJSONDataU = await axios.get(`${pythonURL}/uniqueFolder/${getCSV[0]?.content}`);
      res.send({
        message: "All recorded files CSV",
        theJSON:theJSONDataU?.data
      });
      
    } catch (error) {
      console.log(error)
      res.status(500).send(error)
    }
  }
module.exports = {addUniqueFile ,GetCSV , getautoUnique ,WebHooksUnique}