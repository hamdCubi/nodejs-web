const { ObjectId } = require("mongodb");
const mongoose = require("mongoose");

const contentSchema = new mongoose.Schema({
    baseFileId: mongoose.Schema.Types.ObjectId,
    sourceFileId: mongoose.Schema.Types.ObjectId,
    content: JSON,
    timestamp: { type: Date, default: Date.now }
  });

const Similar = mongoose.model("Similar", contentSchema);

class BlogSimilarModel {
 
  static async AddNewSimilarFile(baseFileId,sourceFileId,content) {
    try {
      const newFileDat = new Similar({
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
  static async getSimilar() {
    try {
      const links = await Similar.find({})
      return links;
    } catch (error) {
      console.error('Error in BlogModel.getLinks:', error);
      throw error;
    }
  }

  static async delete(csvFileIds) {
    try {
      const links = await Similar.deleteMany({
        $or: [
          { baseFileId: { $in: csvFileIds } },
          { sourceFileId: { $in: csvFileIds } }
        ]
      });
      return links;
    } catch (error) {
      console.error('Error in BlogModel.getLinks:', error);
      throw error;
    }
  }
}

module.exports = BlogSimilarModel;
