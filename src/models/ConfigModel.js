const { db } = require('../utils/Database.js');

class ConfigModel {
    static instance;
    static configMap = new Map();

    constructor() {
        if (ConfigModel?.instance) {
            return ConfigModel.instance;
        }
        // Initialize the instance
        ConfigModel.instance = this;
    }

    static async getConfigs() {
        // Check if configs are already in the map
        if (ConfigModel.configMap.size > 0) {
            return ConfigModel.configMap;
        }

        // Assuming db.collection() method is available and it returns a MongoDB collection
        const configs = await db.collection('configs').find().toArray();

        // Populate the map with configs
        for (let config of configs) {
            ConfigModel.configMap.set(config?.name, config?.value);
        }

        return ConfigModel.configMap;
    }
}

module.exports = ConfigModel;
