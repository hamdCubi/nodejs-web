const { ObjectId } = require("mongodb");
const mongoose = require("mongoose");

const contentSchema = new mongoose.Schema({
    baseFileId: mongoose.Schema.Types.ObjectId,
    sourceFileId: mongoose.Schema.Types.ObjectId,
    content: JSON,
    timestamp: { type: Date, default: Date.now }
  });

const Unique = mongoose.model("unique", contentSchema);

class BlogUniqueModel {
 
  static async AddNewUniqueFile(baseFileId,sourceFileId,content) {
    try {
      const newFileDat = new Unique({
        baseFileId:new ObjectId(baseFileId),
        sourceFileId:new ObjectId(sourceFileId),
        content,
        
        timestamp:Date.now()
      });

      await newFileDat.save();
      return newFileDat._id;
    } catch (error) {
      console.error('Error in bologModel.create:', error);
      throw error;
    }
  }
  static async getUnique() {
    try {
      const links = await Unique.find({}, 'fileName _id').lean();
      return links;
    } catch (error) {
      console.error('Error in BlogModel.getLinks:', error);
      throw error;
    }
  }
  static async getUniqueByName() {
    try {
      const links = await Unique.find({}, 'content _id').lean();
      return links;
    } catch (error) {
      console.error('Error in BlogModel.getLinks:', error);
      throw error;
    }
  }

  static async delete() {
    try {
      const links = await Unique.deleteMany({});
      return links;
    } catch (error) {
      console.error('Error in BlogModel.getLinks:', error);
      throw error;
    }
  }
  static async CheckByBaseSorce(baseFileId,sourceFileId) {
    try {
      const links = await Unique.findOne({baseFileId:new ObjectId(baseFileId),sourceFileId:new ObjectId(sourceFileId)},"content _id timestamp");
      return links;
    } catch (error) {
      console.error('Error in BlogModel.getLinks:', error);
      throw error;
    }
  }
}

module.exports = BlogUniqueModel;
