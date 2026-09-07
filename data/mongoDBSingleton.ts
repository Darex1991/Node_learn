import "dotenv/config";
import { Collection, Db, MongoClient, ServerApiVersion } from "mongodb";

const dbUser = process.env.DB_USER;
const dbPassword = process.env.DB_PASSWORD;

if (!dbUser || !dbPassword) {
  throw new Error("DB_USER and DB_PASSWORD must be set in .env");
}

const uri = `mongodb+srv://${dbUser}:${dbPassword}@cluster0.tlqhjkh.mongodb.net/?appName=Cluster0`;

const mongoDBSingleton = async () => {
  let client: MongoClient | undefined;
  let db: Db | undefined;
  let collection: Collection | undefined;

  const getInstance = () => {
    return new Promise(async (resolve, reject) => {
      if (client) {
        return resolve(client);
      }

      try {
        client = new MongoClient(uri, {
          serverApi: {
            version: ServerApiVersion.v1,
            strict: true,
            deprecationErrors: true,
          },
          monitorCommands: true,
        });
        await client.connect();

        db = client.db("quotesdb");
        collection = db.collection("quotes");
        return resolve(client);
      } catch (error) {
        return reject(error);
      }
    });
  };

  const closeInstance = () => {
    return new Promise(async (resolve, reject) => {
      if (!client) {
        return resolve(true);
      }
      try {
        await client.close();
        client = undefined;
        return resolve(true);
      } catch (error) {}
    });
  };

  const getCollection = async () => {
    if (!collection) {
      await getInstance();
    }
    return collection;
  };

  const getDb = async () => {
    if (!db) {
      await getInstance();
    }
    return db;
  };

  return {
    getInstance,
    closeInstance,
    getCollection,
    getDb,
  };
};

const mongoDB = await mongoDBSingleton();
export default mongoDB;
