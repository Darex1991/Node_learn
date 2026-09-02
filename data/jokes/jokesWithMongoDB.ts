import "dotenv/config";
import { MongoClient, ServerApiVersion, type BulkWriteOptions } from "mongodb";

const dbUser = process.env.DB_USER;
const dbPassword = process.env.DB_PASSWORD;

if (!dbUser || !dbPassword) {
  throw new Error("DB_USER and DB_PASSWORD must be set in .env");
}

const uri = `mongodb+srv://${dbUser}:${dbPassword}@cluster0.tlqhjkh.mongodb.net/?appName=Cluster0`;

let mongoClient: MongoClient | null = null;

export const connectToJokesDb = async (): Promise<MongoClient | null | Error> => {
  if (mongoClient) {
    return mongoClient;
  }

  try {
    mongoClient = new MongoClient(uri, {
      serverApi: {
        version: ServerApiVersion.v1,
        strict: true,
        deprecationErrors: true,
      },
      monitorCommands: true,
    });

    await mongoClient.connect();
    console.log("connected to jokes mongodb");
    return mongoClient;
  } catch (error) {
    console.error(error, "error connecting to jokes mongodb");
    await closeMongoClient();
    return new Error("Failed to connect to MongoDB", { cause: error });
  }
};

export const closeMongoClient = async (): Promise<void | Error> => {
  if (mongoClient) {
    await mongoClient.close();
    mongoClient = null;
    return;
  }
  return new Error("MongoDB client not connected");
};
