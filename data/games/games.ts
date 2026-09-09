import "dotenv/config";
import { Collection, Db, MongoClient, ServerApiVersion } from "mongodb";
import mongoose from "mongoose";
import { Game } from "../../model/gameModel.ts";

const dbUser = process.env.DB_USER;
const dbPassword = process.env.DB_PASSWORD;

if (!dbUser || !dbPassword) {
  throw new Error("DB_USER and DB_PASSWORD must be set in .env");
}

const uri = `mongodb+srv://${dbUser}:${dbPassword}@cluster0.tlqhjkh.mongodb.net/?appName=Cluster0`;

export const connect = async () => {
  try {
    const client = mongoose.connect(uri, {
      dbName: "trainingDB",
    });
    mongoose.connection.on("open", function () {
      console.log("mongodb is connected!!");
    });
    return client;
  } catch (error) {
    console.error(error);
    throw error;
  }
};
export const close = async () => {
  await mongoose.disconnect();
};
