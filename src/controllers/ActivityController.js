const { client } = require("../utils/Database");

const db = client.db("scraaptest")

const getLinkActivitiesPending = async(req,res)=>{
try {
    const checkalready = await  db.collection("activities").find(
        {
            event:{$in:["LINK_EXTRACTION", "CSV_EXTRACTION","UNQIUE_COMPARISON"]},
            inProgress:true
        }).sort({ _id: -1 }).toArray()
    res.send(
        {
            message:"activity of links",
            success:true,
            activity:checkalready
        }
    )
} catch (error) {
    console.error("Error in try-catch block:[", catchError);
    res.status(500).json({ error: "Internal server error",catchError });
}
}


module.exports = {getLinkActivitiesPending}