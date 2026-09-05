import "dotenv/config";
import { MongoClient, ServerApiVersion } from "mongodb";

const dbUser = process.env.DB_USER;
const dbPassword = process.env.DB_PASSWORD;

if (!dbUser || !dbPassword) {
  throw new Error("DB_USER and DB_PASSWORD must be set in .env");
}

const uri = `mongodb+srv://${dbUser}:${dbPassword}@cluster0.tlqhjkh.mongodb.net/?appName=Cluster0`;

const initDb = async () => {
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

  try {
    await client.connect();
    console.log("Connected to MongoDB");
  } catch (error) {
    console.error(error);
    await client.close();
    throw error;
  }

  return client;
};

const findCars = async (
  client: MongoClient,
  brand: string,
  resultLimit: number,
) => {
  const cars = await client
    .db("trainingDB")
    .collection("cars")
    .find({ brand })
    .limit(resultLimit)
    .toArray();
  return cars;
};

const getResults = async () => {
  const client = await initDb();
  const brand = "Ford";
  const limit = 2;
  const results = await findCars(client, brand, limit);
  console.log(results);
};

getResults()
  .catch(console.error)
  .finally(async () => {
    const client = await initDb();
    await client.close();
    console.log("Closed connection to MongoDB");
  });
