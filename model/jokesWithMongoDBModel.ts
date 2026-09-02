import type { Collection, InsertManyResult, InsertOneResult, WithId } from "mongodb";
import { connectToJokesDb } from "../data/jokes/jokesWithMongoDB";
import type { JokeWithMongoDB } from "../types/jokes";

const getJokesCollection = async (): Promise<Collection<JokeWithMongoDB> | null> => {
  const mongoClient = await connectToJokesDb();
  if (!mongoClient || mongoClient instanceof Error) {
    return null;
  }
  return mongoClient.db("jokes").collection<JokeWithMongoDB>("jokes");
};

export const getAllJokesCollection = async (): Promise<WithId<JokeWithMongoDB>[] | null> => {
  const collection = await getJokesCollection();
  if (!collection) {
    return null;
  }
  return collection.find().toArray();
};

export const getJokeById = async (
  id: string,
): Promise<WithId<JokeWithMongoDB> | null> => {
  const collection = await getJokesCollection();
  if (!collection) {
    return null;
  }
  return collection.findOne({ id: parseInt(id) });
};

export const createJoke = async (
  joke: JokeWithMongoDB,
): Promise<InsertOneResult<JokeWithMongoDB> | null> => {
  const collection = await getJokesCollection();
  if (!collection) {
    return null;
  }
  return collection.insertOne(joke);
};

export const createManyJokes = async (
  jokesToInsert: JokeWithMongoDB[],
): Promise<InsertManyResult<JokeWithMongoDB> | null> => {
  const collection = await getJokesCollection();
  if (!collection) {
    return null;
  }
  return collection.insertMany(jokesToInsert, { ordered: true });
};
