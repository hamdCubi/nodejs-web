const OpenAI = require("openai")
const dotenv = require('dotenv');
dotenv.config()
const openai = new OpenAI({apiKey:process.env.OPEN_AI_KEY});
const getKeywords = async(req,res)=>{
try {
    const {topic} = req.body
    const completion = await openai.chat.completions.create({
        messages: [
          {
            role: "system",
            content: "You are a helpful assistant designed to output JSON.",
          },
         
          { role: "user", content: `Genrate me a JSON data of Relevent seo related single word OR two word keywords according to the topic below , always return keywords with key "keywords".
            "${topic}"` },
        ],
        model: "gpt-4o-mini",
        response_format: { type: "json_object" },
      });
      console.log(completion.choices[0].message.content);
      res.send(completion.choices[0].message.content)
} catch (error) {
    res.status(500).send(error)
}
}
module.exports = {getKeywords}