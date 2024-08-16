require('dotenv').config();
const app = require('./src/app');
const mongoose = require("mongoose")
const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});

////////////////mongodb connected disconnected events///////////////////////////////////////////////


