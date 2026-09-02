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

export function getMongoClient(): MongoClient {
  if (!mongoClient) {
    throw new Error("MongoDB is not connected. Call connectToMongoDB() first.");
  }
  return mongoClient;
}

export async function closeMongoDB(): Promise<void> {
  if (!mongoClient) {
    return;
  }

  await mongoClient.close();
  mongoClient = null;
}

const insertData = async (client: MongoClient) => {
  const students = [
    { name: "John", age: 20, email: "john@example.com" },
    { name: "Jane", age: 21, email: "jane@example.com" },
    { name: "Jim", age: 22, email: "jim@example.com" },
    { name: "Jill", age: 23, email: "jill@example.com" },
    { name: "Jack", age: 24, email: "jack@example.com" },
  ];
  const result = await client
    .db("schoolDB")
    .collection("students")
    .insertMany(students, { ordered: true });
  console.log(result, "result");
};

export const getProcessDb = async () => {
  const mongoClient = await connectToMongoDB();
  if (!mongoClient) {
    throw new Error("Failed to connect to MongoDB");
  }
  const dbList = await mongoClient.db("schoolDB");
  const collectionList = await dbList.collection("students").find().toArray();
  console.log(collectionList, "collectionList");
  //   await insertData(mongoClient);

  return dbList;
};

export const findStudentByName = async (name: string) => {
  const mongoClient = await connectToMongoDB();

  if (!mongoClient) {
    throw new Error("Failed to connect to MongoDB");
  }
  const dbList = await mongoClient.db("schoolDB");

  const student = await dbList.collection("students").findOne({ name });
  console.log(student, "student");
  return student;
};