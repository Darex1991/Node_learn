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

const addDataToDb = async () => {
  const client = await initDb();
  const collection = client.db("trainingDB").collection("cars");
  const newCars = [
    {
      name: "Car",
      brand: "Ford",
      color: "Red",
    },
    {
      name: "Car",
      brand: "Ford",
      color: "Blue",
    },
  ];

  try {
    const cars = await collection.insertMany(newCars, { ordered: true });
    console.log(cars);
  } catch (error) {
    console.error(error);
    await client.close();
    throw error;
  }
};

const getAllCars = async () => {
  const client = await initDb();
  const collection = client.db("trainingDB").collection("cars");
  const cars = await collection.find({}).toArray();
  console.log(cars, cars.length);
};

const updateCarFieldsMany = async (name: string, updatedFields: any) => {
  const client = await initDb();
  try {
    const collection = client.db("trainingDB").collection("cars");
    const cars = await collection.updateMany({ name }, { $set: updatedFields });
    console.log({ cars }, "updateCarFieldsMany");
  } catch (error) {
    console.error(error);
    await client.close();
    throw error;
  }
};

const updateCarFieldsOne = async (name: string, updatedFields: any) => {
  const client = await initDb();
  try {
    const collection = client.db("trainingDB").collection("cars");
    const cars = await collection.updateOne({ name }, { $set: updatedFields });
    console.log({ cars }, "updateCarFieldsOne");
  } catch (error) {
    console.error(error);
    await client.close();
    throw error;
  }
};

const init = async () => {
  const client = await initDb();
  try {
    await getAllCars();
    await updateCarFieldsMany("Car", { color: "Green", test: 1 });
    await getAllCars();
    await updateCarFieldsOne("Car", { color: "Blue", test: 2 });
    await getAllCars();
  } catch (error) {
    console.error(error);
    await client.close();
    throw error;
  } finally {
    await client.close();
    console.log("Closed connection to MongoDB");
  }
};
init();
