import "dotenv/config";
import { Collection, Db, MongoClient, ServerApiVersion } from "mongodb";
import mongoose, { Error } from "mongoose";
import { FoundationModel } from "../../model/fundationModel.ts";

const dbUser = process.env.DB_USER;
const dbPassword = process.env.DB_PASSWORD;

if (!dbUser || !dbPassword) {
  throw new Error("DB_USER and DB_PASSWORD must be set in .env");
}

const uri = `mongodb+srv://${dbUser}:${dbPassword}@cluster0.tlqhjkh.mongodb.net/?appName=Cluster0`;

export const connect = async () => {
  try {
    const client = mongoose.connect(uri, {
      dbName: "trainingDB",
    });
    mongoose.connection.on("open", function () {
      console.log("mongodb is connected!!");
    });
    return client;
  } catch (error) {
    console.error(error);
    throw error;
  }
};
export const close = async () => {
  await mongoose.disconnect();
};

const devFoundation = async () => {
  const foundation1 = new FoundationModel({
    name: "Foundation 31",
    address: {
      street: "123 Main St",
      city: "Anytown",
      country: "USA",
    },
    volunteers: [
      {
        name: "John Doe",
        email: "john.doe@example.com",
        facebook: "https://www.facebook.com/john.doe",
      },
      {
        name: "Jane Doe2",
        email: "jane.doe@example.com",
        facebook: "https://www.facebook.com/jane.doe",
      },
      {
        name: "Jane Doe3",
        email: "jane.doe@example.com",
        facebook: "https://www.facebook.com/jane.doe",
      },
    ],
  });
  const foundation2 = new FoundationModel({
    name: "Foundation 222",
    address: {
      street: "123 Main St",
      city: "Anytown",
      country: "USA",
    },
  });

  try {
    await foundation1.validate();
    console.log("Foundation is valid");
    const foundationInDB = await FoundationModel.findOne({
      name: foundation1.name,
    });
    if (foundationInDB) {
      console.log("Foundation already exists");
      return;
    }

    await FoundationModel.insertMany([foundation1, foundation2]);
  } catch (err) {
    if (err instanceof Error.ValidationError) {
      console.log(err.message, "errors");
    } else {
      throw err;
    }
  }
};

connect()
  .then(async () => {
    console.log("Connected to MongoDB");
    await devFoundation();

    const foundation = await FoundationModel.findOne({ name: "Foundation 1" });
    const info = foundation?.getRandVolunteer();
    console.log(info, "info");

    const newFoundation = await new FoundationModel({
      name: "Foundation 5",
      address: {
        street: "123 Main St",
        city: "Anytown",
        country: "USA",
      },
      volunteers: [
        {
          name: "John Doe",
          email: "john.doe@example.com",
          facebook: "https://www.facebook.com/john.doe",
        },
        {
          name: "Jane Doe2",
          email: "jane.doe@example.com",
          facebook: "https://www.facebook.com/jane.doe",
        },
        {
          name: "Jane Doe3",
          email: "jane.doe@example.com",
          facebook: "https://www.facebook.com/jane.doe",
        },
      ],
    })
      .save()
      .then((foundation) => {
        foundation.address!.country = "USA2";
        return foundation.validate().then(() => foundation.save());
      })
      .then((foundation) => {
        console.log(foundation, "foundation");
      })
      .catch((error) => {
        console.error(error);
      });

    await close();
  })
  .catch((error) => {
    console.error(error);
    close();
  });
//   .finally(() => {
//     close();
//   });
