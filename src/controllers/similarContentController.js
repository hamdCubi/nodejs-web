const ErrorCode = require('../utils/ErrorCode');
const { execFile } = require('child_process');
const path = require('path');
const BlogCSVModel = require('../models/CSVModels');
const BlogSimilarModel = require('../models/similarContentModels');
const axios = require("axios")


const addsimilarFile = async (req, res) => {
    try {
      const {BasefileName,similarTital} = req.body; 



      const ressponse = await axios.get(`https://python-server-cubi.azurewebsites.net/similar_content/${BasefileName}/${similarTital}?user_id=${req?.user?._id}`);

      console.log(ressponse.data)
      res.send(ressponse?.data);
    } catch (catchError) {
      console.error("Error in try-catch block:", catchError);
      res.status(500).json({ error: "Internal server error",catchError });
    }
  };

  const addfileWithSocket = async (data)=>{
    try {
      const {BasefileName,similarTital} = data; 



      const ressponse = await axios.get(`https://python-server-cubi.azurewebsites.net/similar_content/${BasefileName}/${similarTital}`);

      console.log(ressponse.data)
      return ressponse?.data;
    } catch (catchError) {
      console.error("Error in try-catch block:", catchError);
      return{ error: "Internal server error",catchError };
    }
  }
  const SimilarWEBHOOK = async (req, res) => {
    const { io, connectedUsers } = require("../app");
    
    if (!io) {
        console.error("Socket.IO instance is not initialized.");
        return res.status(500).json({ error: "Socket.IO is not available" });
    }
    
    console.log(connectedUsers, "++++++++++++++++++++++_+++++++++++++++++++++++on initialization check");

    const { result, error, userId } = req.body;
    console.log(connectedUsers);

    try {
        if (userId && connectedUsers.has(userId)) {
            const socketId = connectedUsers.get(userId);
            console.log(socketId);

            if (error) {
                console.error("Received error from Python:", error);
                io.to(socketId).emit("error", { error, message: "Error while similarContent" });
                return res.sendStatus(200);  // Ensure this is the only response sent
            }

            // Parse result if it's a string representing JSON
            let parsedResult;
            try {
                parsedResult = typeof result === 'string' ? JSON.parse(result) : result;
            } catch (parseError) {
                console.error("Error parsing JSON:", parseError.message);
                return res.status(400).json({ error: "Invalid JSON format" });
            }

            io.to(socketId).emit("Similar-Content", parsedResult);
            return res.status(200).json(parsedResult);  // Return parsed JSON response
        }

        // If userId is not present in connectedUsers
        return res.sendStatus(404);  // Adjust status code as necessary
    } catch (catchError) {
        console.error("Error in try-catch block:", catchError.message);
        return res.status(500).json({ error: "Internal server error", catchError });
    }
}


  
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
module.exports = {addsimilarFile ,GetSimilars,SimilarWEBHOOK , addfileWithSocket}