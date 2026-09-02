import "dotenv/config";
import { MongoClient, ServerApiVersion } from "mongodb";

const dbUser = process.env.DB_USER;
const dbPassword = process.env.DB_PASSWORD;

if (!dbUser || !dbPassword) {
  throw new Error("DB_USER and DB_PASSWORD must be set in .env");
}

const uri = `mongodb+srv://${dbUser}:${dbPassword}@cluster0.tlqhjkh.mongodb.net/?appName=Cluster0`;

let mongoClient: MongoClient | null = null;

export async function connectToMongoDB(): Promise<MongoClient | null> {
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
}

export async function closeMongoDB(): Promise<void> {
  if (!mongoClient) {
    return;
  }

  await mongoClient.close();
  mongoClient = null;
}
