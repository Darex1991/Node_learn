import { ObjectId } from "mongodb";
import mongoDBSingleton from "../data/mongoDBSingleton";
import type { Quote } from "../types/quotes";

export const saveAll = async (quotes: Omit<Quote, "_id">[]) => {
  return new Promise(async (resolve, reject) => {
    const collection = await mongoDBSingleton.getCollection();
    if (!collection) {
      return reject(new Error("Collection not found"));
    }

    try {
      const result = await collection.insertMany(quotes, { ordered: true });
      if (result.insertedCount) {
        return resolve(result);
      } else {
        return reject(new Error("No quotes inserted"));
      }
    } catch (error) {
      return reject(error);
    }
  });
};

export const getAllQuotes = async () => {
  return new Promise(async (resolve, reject) => {
    const collection = await mongoDBSingleton.getCollection();

    const result = await collection?.find({}).toArray();

    if (result && result.length > 0) {
      return resolve(result);
    } else {
      return reject(new Error("No quotes found"));
    }
  });
};

export const getById = async (id: string) => {
  return new Promise(async (resolve, reject) => {
    const collection = await mongoDBSingleton.getCollection();

    const result = await collection?.findOne({ _id: new ObjectId(id) });

    if (result) {
      return resolve(result);
    } else {
      return reject(new Error("Quote not found"));
    }
  });
};

export const removeById = async (id: string) => {
  return new Promise(async (resolve, reject) => {
    const collection = await mongoDBSingleton.getCollection();
    if (!collection) {
      return reject(new Error("Collection not found"));
    }

    const result = await collection?.deleteOne({ _id: new ObjectId(id) });
    if (result?.deletedCount) {
      return resolve(result);
    } else {
      return reject(new Error("Quote not found"));
    }
  });
};

export const updateQuoteById = async (id: string, quote: Partial<Quote>) => {
  return new Promise(async (resolve, reject) => {
    const collection = await mongoDBSingleton.getCollection();
    if (!collection) {
      return reject(new Error("Collection not found"));
    }

    console.log(quote, "quote");
    const result = await collection.updateOne(
      { _id: new ObjectId(id) },
      { $set: quote },
    );

    if (result && result.matchedCount > 0) {
      return resolve(result);
    } else {
      return reject(new Error("Quote not found"));
    }
  });
};