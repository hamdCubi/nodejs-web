const mongoose = require('mongoose');

const options = {
  maxPoolSize: 10, // Limit the number of connections in the pool
  useNewUrlParser: true, // Parse connection string with useNewUrlParser
  useUnifiedTopology: true, // Use new Server Discover and Monitoring engine
};

const dbName = "blogAI";
const uri = "mongodb://localhost:27017/" + dbName + "?retryWrites=true&w=majority";

mongoose.connect(uri, options);

mongoose.connection.on('connected', function () {
  console.log("Mongoose is connected to " + dbName);
});

mongoose.connection.on('disconnected', function () {
  console.log("Mongoose is disconnected");
  process.exit(1); // Exit process on disconnect
});

mongoose.connection.on('error', function (err) {
  console.log('Mongoose connection error: ', err);
  process.exit(1); // Exit process on errora
});

process.on('SIGINT', async function () {
  await mongoose.connection.close();
  console.log("Mongoose connection is disconnected due to app termination");
  process.exit(0);
});

