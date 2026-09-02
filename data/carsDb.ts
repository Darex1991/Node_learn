import "dotenv/config";
import { MongoClient, ServerApiVersion } from "mongodb";

const dbUser = process.env.DB_USER;
const dbPassword = process.env.DB_PASSWORD;

if (!dbUser || !dbPassword) {
  throw new Error("DB_USER and DB_PASSWORD must be set in .env");
}

const uri = `mongodb+srv://${dbUser}:${dbPassword}@cluster0.tlqhjkh.mongodb.net/?appName=Cluster0`;

let mongoClient: MongoClient | null = null;

export const connectToCarsDb = async () => {
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

const getCarsDb = async () => {
  const client = await connectToCarsDb();
  if (!client) {
    throw new Error("Failed to connect to MongoDB");
  }
  const db = client.db("trainingDB");
  const cars = await db.collection("cars").find().toArray();
  console.log(cars, "cars");
  return cars;
};

type Car = {
  name: string;
  brand: string;
  color: string;
};

const insertOneCar = async (client: MongoClient, car: Car) => {
  const db = client.db("trainingDB");
  const result = await db.collection("cars").insertOne(car);
  console.log(result, "result");
  return result;
};

const insertManyCars = async (client: MongoClient, cars: Car[]) => {
  const db = client.db("trainingDB");
  const result = await db
    .collection("cars")
    .insertMany(cars, { ordered: true });
  console.log(result, "result");
  return result;
};

export const insertCars = async () => {
  const client = await connectToCarsDb();
  if (!client) {
    throw new Error("Failed to connect to trainingDB MongoDB");
  }
  await insertOneCar(client, {
    name: "Car 1",
    brand: "Brand 3",
    color: "Color 3",
  });
  await insertOneCar(client, {
    name: "Car 2",
    brand: "Brand 2",
    color: "Color 2",
  });

  await insertManyCars(client, [
    { name: "Car 3", brand: "Brand 3", color: "Color 3" },
    { name: "Car 4", brand: "Brand 4", color: "Color 4" },
  ]);

  return await getCarsDb();
};

export const closeMongoClient = async () => {
  if (mongoClient) {
    await mongoClient.close();
    mongoClient = null;
  }
};
