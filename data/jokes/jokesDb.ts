import "dotenv/config";
import { MongoClient, ServerApiVersion, type BulkWriteOptions } from "mongodb";

const dbUser = process.env.DB_USER;
const dbPassword = process.env.DB_PASSWORD;

if (!dbUser || !dbPassword) {
  throw new Error("DB_USER and DB_PASSWORD must be set in .env");
}

const uri = `mongodb+srv://${dbUser}:${dbPassword}@cluster0.tlqhjkh.mongodb.net/?appName=Cluster0`;

let mongoClient: MongoClient | null = null;

type Joke = {
  joke: string;
};

export const connectToJokesDb = async () => {
  if (mongoClient) {
    return mongoClient;
  }

  const client = new MongoClient(uri, {
    serverApi: {
      version: ServerApiVersion.v1,
      strict: true,
      deprecationErrors: true,
    },
    monitorCommands: true,
  });

  client.on("commandStarted", (event) => {
    console.log(event, "commandStarted");
  });
  client.on("commandSucceeded", (event) => {
    console.log(event, "commandSucceeded");
  });
  client.on("commandFailed", (event) => {
    console.log(event, "commandFailed");
  });

  try {
    mongoClient = await client.connect();
    console.log("MongoDB connected");
    return mongoClient;
  } catch (error) {
    console.error(error, "error");
    await client.close();
    return null;
  }
};

export const closeMongoClient = async () => {
  if (mongoClient) {
    await mongoClient.close();
    mongoClient = null;
  }
}

export const getJokesDb = async () => {
  if (!mongoClient) {
    await connectToJokesDb();
  }
  return mongoClient?.db("jokes");
};

export const insertJoke = async (joke: Joke) => {
  const db = await getJokesDb();
  if (!db) {
    throw new Error("Database not connected");
  }
  const result = await db.collection("jokes").insertOne({ joke });
  return result;
};

export const insertManyJokes = async (jokes: Joke[], options: BulkWriteOptions) => {
  const db = await getJokesDb();
  if (!db) {
    throw new Error("Database not connected");
  }
  const result = await db.collection("jokes").insertMany(jokes, options);
  return result;
};