const { ObjectId } = require("mongodb");
const mongoose = require("mongoose");

const blogLinkSchema = new mongoose.Schema({
    fileName: {
      type: String,
      required: true
    },
   
    timestamp: {
      type: Date,
      default: Date.now
    },
    siteLink: {
      type: String,
      required: true
    },
  
  });

const LinkFiles = mongoose.model("LinkFiles", blogLinkSchema);

class BlogModel {
  static async AddNewFile(fileName, SiteURL) {
    try {
      const newFileDat = new LinkFiles({
        fileName,
        
        siteLink:SiteURL,
        timestamp:Date.now()
      });

      await newFileDat.save();
      return newFileDat._id;
    } catch (error) {
      console.error('Error in bologModel.create:', error);
      throw error;
    }
  }
  static async findbysiteURL(SiteURL) {
    try {
      
      
      const linkfile = await LinkFiles.findOne({siteLink:SiteURL});

      
      return linkfile
    } catch (error) {
      console.error('Error in bologModel.create:', error);
      throw error;
    }
  }
  static async delete(SiteURL) {
    try {
      
      
      const deletefile = await LinkFiles.deleteOne({siteLink:SiteURL});

      
      return deletefile
    } catch (error) {
      console.error('Error in bologModel.create:', error);
      throw error;
    }
  }
  static async AddNewCSVFile(fileName, userId, SiteURL) {
    try {
      const newFileDat = new LinkFiles({
        fileName,
        userId:new ObjectId(userId),
        siteLink:SiteURL,
        timestamp:Date.now()
      });

      await newFileDat.save();
      return newFileDat._id;
    } catch (error) {
      console.error('Error in bologModel.create:', error);
      throw error;
    }
  }
  static async getLinks() {
    try {
      const links = await LinkFiles.find({}, 'siteLink fileName _id').lean();
      return links;
    } catch (error) {
      console.error('Error in BlogModel.getLinks:', error);
      throw error;
    }
  }
  static async getLinksBYTime() {
    try {
      const currentDate = new Date();
      // Calculate the date one week ago
      const oneWeekAgo = new Date(currentDate.setDate(currentDate.getDate() - 1));

      const links = await LinkFiles.find({ timestamp: { $lt: oneWeekAgo } }, 'siteLink filame _id').lean();
      return links;
    } catch (error) {
      console.error('Error in BlogModel.getLinks:', error);
      throw error;
    }
  }

  
}

module.exports = BlogModel;
