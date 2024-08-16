const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const morgan = require("morgan");
const mongoose = require("mongoose")
const axios = require("axios")
const cookieParser = require("cookie-parser")
const path = require("path")
const cors =require("cors")
const cron = require("node-cron")
// const {authRoutes} = require("./controllers/autoUpdate.js")
app.use(morgan('dev'));
app.use(bodyParser.json({ limit: '50mb' })); // for JSON requests
app.use(bodyParser.urlencoded({ limit: '50mb', extended: true })); // for URL-encoded requests

app.use(express.json())
app.use(cookieParser());
app.use(cors({
    origin: ['http://localhost:3000', "https://muhammadhamd.up.railway.app","http://192.168.18.5:3000",'http://192.168.100.227:3000'],
    credentials: true
}));


cron.schedule('0 */1 * * *', async () => {
  console.log('Running a task every 1 hours');
  // Your function here
  const theUpdateis = await autoUpdater();
  console.log(theUpdateis);
});

app.use((req, res, next) => {
    console.log(req.method, req.url);
    next();
})
const Topy = require('./routes/ToPy.js');
const authRoutes = require('./routes/AuthRoutes');
const blogRoutes = require('./routes/blogsRoute');
const GoogleAPIRoutes = require('./routes/googelAPIRoute.js');
const openAIRoutes = require('./routes/openairoute.js');
const { autoUpdater } = require('./controllers/autoUpdate.js');



app.get("/tocheck",async(req,res)=>{

  try {
    const resp = await axios.get("https://python-server-cubi.azurewebsites.net/")
    console.log(resp.data)
    res.send(res.data)
  } catch (error) {
    console.log(error)
    res.status(500).send(error)
    
  }
 
})


app.use('/api/py', Topy);
app.use('/api/auth', authRoutes);
app.use('/api/blog', blogRoutes);
app.use('/api/openai', openAIRoutes);
app.use('/api/google', GoogleAPIRoutes);



//Error handler
app.use(express.static(path.join(__dirname, '../build')))
app.use(('/'),express.static(path.join(__dirname, '../build')))

app.get("*", (req, res) => {
    res.sendFile(path.join(__dirname, '../build/index.html'));
  });



const options = {
    maxPoolSize: 10, // Limit the number of connections in the pool
    useNewUrlParser: true, // Parse connection string with useNewUrlParser
    useUnifiedTopology: true, // Use new Server Discover and Monitoring engine
  };
  
  const dbName = "blog";
  const uri = "mongodb+srv://muhammadhamdali572:hamdali99332@cluster0.g7j5dka.mongodb.net/blog?retryWrites=true&w=majority";
  
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
  
  

module.exports = app;
