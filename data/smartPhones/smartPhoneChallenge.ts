import "dotenv/config";
import { Collection, MongoClient, ServerApiVersion } from "mongodb";

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

const closeDB = async (client: MongoClient) => {
  await client.close();
  console.log("Closed connection to MongoDB");
};
const phonesToAdd = [
  { brand: "Apple", name: "iPhone", color: "red" },
  { brand: "Apple", name: "iPhone", color: "white" },
  { brand: "Apple", name: "iPhone", color: "black" },
  { brand: "Apple", name: "iPhone", color: "green" },
];

const addPhones = async (collection: Collection) => {
  const client = await initDb();
  try {
    const phones = await collection.insertMany(phonesToAdd, { ordered: true });
    console.log({ phones }, "addedPhones");
  } catch (error) {
    console.error(error);
    await client.close();
    throw error;
  }
};

const showSmartPhones = async (
  collection: Collection,
  options = {},
  resultsLimit = 10,
) => {
  const phones = await collection.find(options).limit(resultsLimit).toArray();
  console.log({ phones }, "showSmartPhones");

  if (phones.length > 0) {
    console.log("Phones found");
  } else {
    console.log("No phones found");
  }

  return phones;
};

const updateSmartphonesByName = async (
  collection: Collection,
  name: string,
  updatedFields: any,
) => {
  const client = await initDb();

  try {
    const phones = await collection.updateMany(
      { name },
      { $set: updatedFields },
    );
    console.log({ phones }, "updatedSmartphonesByName");
  } catch (error) {
    console.error(error);
    await client.close();
    throw error;
  }
};

const updateSmartphoneByName = async (
  collection: Collection,
  name: string,
  updatedFields: any,
) => {
  const client = await initDb();

  try {
    const phones = await collection.updateOne(
      { name },
      { $set: updatedFields },
    );
    console.log({ phones }, "updatedSmartphoneByName");
  } catch (error) {
    console.error(error);
    await client.close();
    throw error;
  }
};
const init = async () => {
  const client = await initDb();
  try {
    const collection = await client.db("trainingDB").collection("smartPhones");
    console.log({ collection }, "collection");
    await addPhones(collection);
    await showSmartPhones(collection);

    await updateSmartphonesByName(collection, "iPhone", { max: 10 });
    await updateSmartphoneByName(collection, "iPhone", {
      color: "silver",
      screenSize: 6,
      data: { apps: ["maps", "chrome", "safari"] },
    });
    await showSmartPhones(collection);
    await closeDB(client);
  } catch (error) {
    console.error(error);
    await client.close();
    throw error;
  }
};

init();
