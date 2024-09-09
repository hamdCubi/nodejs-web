const {MongoClient} =require('mongodb')

const swidb = false
const uri = swidb ?"mongodb://localhost:27017" :"mongodb+srv://muhammadhamdali572:hamdali99332@cluster0.g7j5dka.mongodb.net/scraaptest?retryWrites=true&w=majority";
const client = new MongoClient(uri);

async function run() {
    try {
        await client.connect();
        console.log("Successfully connected to Atlas");
    } catch (err) {
        console.log(err.stack);
        await client.close();
        process.exit(1)
    }
}
run().catch(console.dir);

process.on('SIGINT', async function () {
    console.log("app is terminating");
    await client.close();
    process.exit(0);
});

module.exports  ={client}