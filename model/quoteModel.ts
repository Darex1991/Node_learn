import { ObjectId } from "mongodb";
import mongoDBSingleton from "../data/mongoDBSingleton";
import type { Quote } from "../types/quotes";

export const saveAll = async (quotes: Omit<Quote, "_id">[]) => {
  const collection = await mongoDBSingleton.getCollection();
  if (!collection) {
    throw new Error("Collection not found");
  }

  const result = await collection.insertMany(quotes, { ordered: true });
  if (!result.insertedCount) {
    throw new Error("No quotes inserted");
  }
  return result;
};

export const getAllQuotes = async () => {
  const collection = await mongoDBSingleton.getCollection();

  const result = await collection?.find({}).toArray();
  if (!result || result.length === 0) {
    throw new Error("No quotes found");
  }
  return result;
};

export const getById = async (id: string) => {
  const collection = await mongoDBSingleton.getCollection();

  const result = await collection?.findOne({ _id: new ObjectId(id) });
  if (!result) {
    throw new Error("Quote not found");
  }
  return result;
};

export const removeById = async (id: string) => {
  const collection = await mongoDBSingleton.getCollection();
  if (!collection) {
    throw new Error("Collection not found");
  }

  const result = await collection.deleteOne({ _id: new ObjectId(id) });
  if (!result?.deletedCount) {
    throw new Error("Quote not found");
  }
  return result;
};

export const updateQuoteById = async (id: string, quote: Partial<Quote>) => {
  const collection = await mongoDBSingleton.getCollection();
  if (!collection) {
    throw new Error("Collection not found");
  }

  console.log(quote, "quote");
  const result = await collection.updateOne(
    { _id: new ObjectId(id) },
    { $set: quote },
  );

  if (!result || result.matchedCount === 0) {
    throw new Error("Quote not found");
  }
  return result;
};
