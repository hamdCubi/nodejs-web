const { client } = require("../utils/Database");
const {ObjectId} = require("mongodb")

const db = client.db("scraaptest")

const insertActivity = async(user,metaData)=>{
    try {
        
        const activityInserted=  await  db.collection("similarLogs").insertOne({
            user:{
                name:user?.name,
                _id:new ObjectId(user._id),
                email:user.email
            },
            metaData,
            timestamp:Date.now(),
            updatedAt:Date.now()
    
          })
          return activityInserted
    } catch (error) {
        throw error
        console.log(error)
    }
}
const getlog = async(user,metaData)=>{
    try {
        
        const activityInserted=  await  db.collection("similarLogs").findOne({
        "metaData.topic":metaData.topic.toLowerCase()
          })
          return activityInserted
    } catch (error) {
        throw error
        console.log(error)
    }
}
const Updatelog = async(user,metaData)=>{
    try {
        
        const activityInserted=  await  db.collection("similarLogs").findOneAndUpdate({
        "metaData.topic":metaData.topic.toLowerCase()
          },
        {
            $set:{
                updatedAt:Date.now(),
                metaData,

            }
        })
          return activityInserted
    } catch (error) {
        throw error
        console.log(error)
    }
}


module.exports ={insertActivity,getlog,Updatelog}