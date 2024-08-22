require('dotenv').config();
const { app, server } = require('./src/app');

const PORT = process.env.PORT || 4000;
server.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
