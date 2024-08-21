const mongoose = require("mongoose");

const autoUpdateSchema = new mongoose.Schema({
    timestamp: {
        type: Date,
        default: Date.now
    }
});

const LinkFiles = mongoose.model("autoUpdate", autoUpdateSchema);

class AutoUpdateModel {

    static async getLastUpdate() {
        try {
            const links = await LinkFiles.find({}).lean();
            return links[0];
        } catch (error) {
            console.error('Error in autoupdatemodel.getLastUpdate:', error);
            throw error;
        }
    }

    static async InsertLastUpdate() {
        try {
            const links = new LinkFiles({
                timestamp: Date.now()
            });

            await links.save(); // Save the instance of LinkFiles
            return links;
        } catch (error) {
            console.error('Error in autoupdatemodel.InsertLastUpdate:', error);
            throw error;
        }
    }

    static async updateLastUpdate(id, newTimestamp) {
        try {
            const updatedLinks = await LinkFiles.findByIdAndUpdate(
                id,
                { timestamp: newTimestamp },
                { new: true } // Return the updated document
            );

            return updatedLinks;
        } catch (error) {
            console.error('Error in autoupdatemodel.updateLastUpdate:', error);
            throw error;
        }
    }
}

module.exports = AutoUpdateModel;
