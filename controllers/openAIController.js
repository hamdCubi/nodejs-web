const OpenAI = require("openai")
const dotenv = require('dotenv');
const {ObjectId} = require("mongodb")
const { insertActivity, getlog, Updatelog } = require("../models/similarlog");
dotenv.config()
const { client } = require("../utils/Database")
const db = client.db("scraaptest")

const openai = new OpenAI({apiKey:process.env.OPEN_AI_KEY});
const getKeywords = async (req, res) => {
  try {
    const { topic } = req.body;
    const titleToArray = topic.split("|||").filter((title) => title.trim() !== '');

    let alterRes = [];

    // Loop over each topic
    for (const ea of titleToArray) {
      const completion = await openai.chat.completions.create({
        messages: [
          {
            role: "system",
            content: "You are a helpful assistant designed to output JSON.",
          },
          {
            role: "user",
            content: `Generate me a JSON data of relevant SEO focus keywords for content marketing in Dubai according to the topic below. Always return 10 keywords with key "keywords". "${ea}"`,
          },
        ],
        model: "gpt-4o-mini",
        response_format: { type: "json_object" },
      });

      const content = JSON.parse(completion.choices[0].message.content);
      const metaData = {
        topic: ea.toLowerCase(),
        AiKeyword: content.keywords || [],
      };

      const checkActivity = await getlog(req.user, metaData);
      if (checkActivity) {
        await Updatelog(req.user, metaData);
      } else {
        await insertActivity(req.user, metaData);
      }

      alterRes.push({ topic: ea, keywords: content.keywords });
    }

    // Sending the final response
    res.send(alterRes);
  } catch (error) {
    res.status(500).send(error.message || error);
    console.log(error);
  }
};


const getGenratedKeywords = async(req,res)=>{
  try {
    if (!req?.query?.topicid) {
      return res.status(400).send({message:"topic is not provided"})
    }
    if (!ObjectId.isValid(req.query.topicid)) {
      return res.status(400).send({message:"the provided id is not valid"})

    }
    const Logs =await db.collection("similarLogs").findOne({_id:new ObjectId(req.query.topicid)})
     if (!Logs) {
      return res.status(404).send({message:"no log found"})
     }
     res.send({
       message:"geted",
       content:Logs
     })
 } catch (error) {
   console.log(error)
   
     res.status(500).send({
       message:"internal server error please retry",
       error
     })
     
 }
}
module.exports = {getKeywords,getGenratedKeywords}