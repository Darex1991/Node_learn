import "dotenv/config";
import { Collection, Db, MongoClient, ServerApiVersion } from "mongodb";
import mongoose from "mongoose";

const dbUser = process.env.DB_USER;
const dbPassword = process.env.DB_PASSWORD;

if (!dbUser || !dbPassword) {
  throw new Error("DB_USER and DB_PASSWORD must be set in .env");
}

const uri = `mongodb+srv://${dbUser}:${dbPassword}@cluster0.tlqhjkh.mongodb.net/?appName=Cluster0`;

const computerSchema = new mongoose.Schema({
  _id: mongoose.Types.ObjectId,
  brand: String,
  name: String,
  cpu: String,
  gpu: String,
  ram: {
    slot1: String,
    slot2: String,
  },
  createdAt: {
    data: Date,
  },
});

const connect = async () => {
  try {
    const connection = await mongoose.connect(uri, {
      dbName: "trainingDB",
    });
    mongoose.connection.on("open", function () {
      console.log("mongodb is connected!!");
    });
    return connection;
  } catch (error) {
    console.error(error);
    throw error;
  }
};

const close = async () => {
  try {
    await mongoose.disconnect();
  } catch (error) {
    console.error(error);
    throw error;
  }
};

const Computer = mongoose.model("Computer", computerSchema);

connect()
  .then(async () => {
    const computer = new Computer({
      _id: new mongoose.Types.ObjectId(),
      brand: "Dell",
      name: "XPS 13",
      cpu: "Intel Core i5",
      gpu: "NVIDIA GeForce GTX 1050 Ti",
      ram: { slot1: "8GB", slot2: "8GB" },
    });
    await computer.save();
  })
  .then(() => {
    console.log("computer saved");
    Computer.find({}).then((computers) => {
      console.log(computers);
    });
    close();
  });
