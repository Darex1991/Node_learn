import "dotenv/config";
import { Collection, MongoClient, ServerApiVersion } from "mongodb";

const dbUser = process.env.DB_USER;
const dbPassword = process.env.DB_PASSWORD;

if (!dbUser || !dbPassword) {
  throw new Error("DB_USER and DB_PASSWORD must be set in .env");
}

const uri = `mongodb+srv://${dbUser}:${dbPassword}@cluster0.tlqhjkh.mongodb.net/?appName=Cluster0`;

const names = [
  "Ewelina",
  "Anna",
  "Zofia",
  "Kasia",
  "Zuzanna",
  "Julia",
  "Monika",
  "Agnieszka",
];
const surnames = ["Kowalska", "Nowak", "Wiśniewska"];
const cities = [
  "Warszawa",
  "Kraków",
  "Wrocław",
  "Poznań",
  "Gdańsk",
  "Szczecin",
  "Bydgoszcz",
  "Lublin",
  "Katowice",
  "Białystok",
];
const randomgAge = () => Math.floor(Math.random() * 33) + 18;

const initDB = async () => {
  const client = new MongoClient(uri, {
    serverApi: {
      version: ServerApiVersion.v1,
      strict: true,
      deprecationErrors: true,
    },
    monitorCommands: true,
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

const generateRandomStudent = () => {
  const name = names[Math.floor(Math.random() * names.length)];
  const surname = surnames[Math.floor(Math.random() * surnames.length)];
  const city = cities[Math.floor(Math.random() * cities.length)];
  const age = randomgAge();
  return { name, surname, city, age };
};

const getStudents = async (
  collection: Collection,
  options = {},
  resultsLimit = 5,
) => {
  const students = await collection.find(options).limit(resultsLimit).toArray();
  if (students.length > 0) {
    console.log("Students found");
  } else {
    console.log("No students found");
  }
  return students;
};

const updateStudent = async (
  collection: Collection,
  options = {},
  updatedFields: any,
) => {
  const result = await collection.updateOne(options, { $set: updatedFields });
  console.log({ result }, "updateStudent");
  return result;
};

const updateStudents = async (
  collection: Collection,
  options = {},
  updatedFields: any,
) => {
  const result = await collection.updateMany(options, { $set: updatedFields });
  return result;
};

const deleteStudents = async (collection: Collection, options = {}) => {
  const result = await collection.deleteMany(options);
  return result;
};

const getOrAdd = async (collection: Collection, options = {}) => {
  const students = await collection.find({}).toArray();
  if (!students.length) {
    const students = [...Array(20)].map(() => generateRandomStudent());
    await collection.insertMany(students);
    return students;
  } else {
    console.log("Students already exist");
    return students;
  }
};

const init = async () => {
  const client = await initDB();
  try {
    const collection = await client.db("trainingDB").collection("students");
    await getOrAdd(collection);
    const result = await deleteStudents(collection, { name: "Kasia" });
    console.log("deleted", result.deletedCount);

    const studentFound = await getStudents(collection, {}, 100);
    console.log("studentFound", studentFound.length);

    const studentFound2 = await getStudents(
      collection,
      { age: { $gt: 30 } },
      100,
    );
    console.log("studentFound2", studentFound2.length);
  } catch (error) {
    console.error(error);
    await client.close();
    throw error;
  } finally {
    await closeDB(client);
  }
};
init();
