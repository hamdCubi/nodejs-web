require('dotenv').config();
const app = require('./app');
const mongoose = require("mongoose")
const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});

////////////////mongodb connected disconnected events///////////////////////////////////////////////


