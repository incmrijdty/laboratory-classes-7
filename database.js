const mongodb = require("mongodb");
const MongoClient = mongodb.MongoClient;
let { DB_PASS, DB_USER } = require("./config");

const mongoConnect = (callback) => {
    const uri = `mongodb+srv://${DB_USER}:${DB_PASS}@labtestdb.wn5ltez.mongodb.net/?retryWrites=true&w=majority&appName=labTestDB`;
  
    MongoClient.connect(uri)

    .then (client => {
        console.log("Connection to the database has been established");
        database = client.db("shop");
        callback();
    })
    .catch((error) => console.log("Database connection failed:", error));
}

const getDatabase = () => {
    if (!database) {
        throw new Error("No database found");
    }
    return database;
}

module.exports = { mongoConnect, getDatabase };
