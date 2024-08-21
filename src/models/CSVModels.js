const { ObjectId } = require("mongodb");
const mongoose = require("mongoose");


const blogLinkSchema = new mongoose.Schema({
    fileName: {
      type: String,
      required: true
    },
    refLinksFile: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'LinkFiles', 
      required: true
    },
    refLinksFileName: {
      type: String,
      ref: 'linkfiles', 
      required: true
    },
    timestamp: {
      type: Date,
      default: Date.now
    }, 
  });

const LinkFiles = mongoose.model("CSVFile", blogLinkSchema);

class BlogCSVModel {
 
  static async AddNewCSVFile(fileName, refLinksFileID,reffilename) {
    try {
      const newFileDat = new LinkFiles({
        fileName,
        refLinksFileName:reffilename,
        refLinksFile:new ObjectId(refLinksFileID),
        timestamp:Date.now()
      });

      await newFileDat.save();
      return newFileDat._id;
    } catch (error) {
      console.error('Error in bologModel.create:', error);
      throw error;
    }
  }
  static async getCSVS() {
    try {
      const links = await LinkFiles.aggregate([
        {
          $lookup: {
            from: "linkfiles", // The collection to join with
            localField: "refLinksFile", // The field from the current collection
            foreignField: "_id", // The field from the foreign collection
            as: "linkDetails", // The output array field
          },
        },
        {
          $unwind: "$linkDetails", // Unwind the array to denormalize the data
        },
        {
          $project: {
            fileName: 1,
            refLinksFileName: 1,
            "linkDetails.siteLink": 1, // Only include necessary fields
          },
        },
      ]);

      return links;
    } catch (error) {
      console.error('Error in BlogCSVModel.getCSVS:', error);
      throw error;
    }
  }
  static async deletebyRef(refId) {
    try {
      const deletedDoc = await LinkFiles.findOneAndDelete({ refLinksFile:new ObjectId(refId) }, { projection: { _id: 1 } }).lean();
      
      return deletedDoc;
    } catch (error) {
      console.error('Error in BlogModel.getLinks:', error);
      throw error;
    }
  }
  static async getCSVById() {
    try {
      const links = await LinkFiles.find({}, 'fileName _id').lean();
      return links;
    } catch (error) {
      console.error('Error in BlogModel.getLinks:', error);
      throw error;
    }
  }

  
}

module.exports = BlogCSVModel;
