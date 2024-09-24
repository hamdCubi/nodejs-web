const express = require('express');
const bodyParser = require('body-parser');
const morgan = require("morgan");
const mongoose = require("mongoose");
const axios = require("axios");
const cookieParser = require("cookie-parser");
const path = require("path");
const cors = require("cors");
const cron = require("node-cron");
const http = require('http');
const { Server } = require("socket.io");

const app = express();
const server = http.createServer(app);

 // Initialize Socket.IO with the HTTP server
const io = new Server(server, {
  cors: {
      origin: '*', // Allow all origins
      methods: ['GET', 'POST'],
      allowedHeaders: ['Content-Type'],
      credentials: true
  }
});
// Map to store connected users and their socket IDs
const connectedUsers = new Map();


app.use(morgan('dev'));
app.use(bodyParser.json({ limit: '50mb' }));
app.use(bodyParser.urlencoded({ limit: '50mb', extended: true }));
app.use(express.json());
app.use(cookieParser());
app.use(cors({
    origin: ['http://localhost:3000', "https://muhammadhamd.up.railway.app", "http://192.168.18.5:3000", 'http://192.168.100.227:3000'],
    credentials: true
}));

cron.schedule('0 */1 * * *', async () => {
    console.log('Running a task every 1 hours');
    const theUpdateis = await autoUpdater();
    console.log(theUpdateis);
});

app.use((req, res, next) => {
    console.log(req.method, req.url);
    next();
});

const Topy = require('./routes/ToPy.js');
const WebHooks = require('./routes/WebHooks.js');
const authRoutes = require('./routes/AuthRoutes');
const blogRoutes = require('./routes/blogsRoute');
const GoogleAPIRoutes = require('./routes/googelAPIRoute.js');
const openAIRoutes = require('./routes/openairoute.js');
const ActivitiesRoutes = require('./routes/activityRoutes.js');
const { autoUpdater } = require('./controllers/autoUpdate.js');

app.get("/tocheck", async (req, res) => {
    try {
        const resp = await axios.get("http://4.213.60.40:8000/");
        console.log(resp.data);
        res.send(res.data);
    } catch (error) {
        console.log(error);
        res.status(500).send(error);
    }
});

app.use('/api/py', Topy);
app.use('/api/activity', ActivitiesRoutes);
app.use('/api/webhook', WebHooks);
app.use('/api/auth', authRoutes);
app.use('/api/blog', blogRoutes);
app.use('/api/openai', openAIRoutes);
app.use('/api/google', GoogleAPIRoutes);


app.get('/download-csv/:fileName', async (req, res) => {
  const { fileName } = req.params;
  const url = `http://4.213.60.40:8000/uniqueFolder/${fileName}`;

  try {
    const response = await axios.get(url, { responseType: 'arraybuffer' }); // Use arraybuffer for binary data
    const buffer = Buffer.from(response.data, 'binary');

    res.setHeader('Content-Type', 'text/csv');
    res.setHeader('Content-Disposition', `attachment; filename=${fileName}`);
    res.send(buffer);
  } catch (error) {
    console.error('Error proxying the CSV file:', error);
    res.status(500).send('Failed to download file');
  }
});

// Middleware for Socket.IO
io.use((socket, next) => {
    // You can add authentication or other middleware here if needed
    next();
});

// Handle new connections
io.on('connection', (socket) => {
  console.log('A user connected:', socket.id);
  socket.on('authenticate', (userId) => {
    connectedUsers.set(userId, socket.id);
    console.log(`User ${userId} authenticated with socket ID ${socket.id}`);
    console.log('Connected Users:', connectedUsers); // Add this log
  });
  socket.on('disconnect', () => {
    connectedUsers.forEach((id, userId) => {
      if (id === socket.id) {
        connectedUsers.delete(userId);
      }
    });
    console.log('User disconnected:', socket.id);
    console.log('Connected Users:', connectedUsers); // Add this log
  });
});

// Making Socket.IO globally available
app.set('socketio', io);

app.use(express.static(path.join(__dirname, '../build')));
app.use(('/', express.static(path.join(__dirname, '../build'))));

app.get("*", (req, res) => {
    res.sendFile(path.join(__dirname, '../build/index.html'));
});

const options = {
    maxPoolSize: 10,
    useNewUrlParser: true,
    useUnifiedTopology: true,
};

const swidb = true
// const uri ="mongodb://localhost:27017/blog"
const uri ="mongodb+srv://muhammadhamdali572:hamdali99332@cluster0.g7j5dka.mongodb.net/scraaptest?retryWrites=true&w=majority";
console.log(uri)
mongoose.connect(uri, options);

mongoose.connection.on('connected', function () {
    console.log("Mongoose is connected to " );
});

mongoose.connection.on('disconnected', function () {
    console.log("Mongoose is disconnected");
    process.exit(1);
});

mongoose.connection.on('error', function (err) {
    console.log('Mongoose connection error: ', err);
    process.exit(1);
});

process.on('SIGINT', async function () {
    await mongoose.connection.close();
    console.log("Mongoose connection is disconnected due to app termination");
    process.exit(0);
});

module.exports = { app, server, io, connectedUsers };
