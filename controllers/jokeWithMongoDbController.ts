import type { InsertManyResult, InsertOneResult } from "mongodb";
import * as jokesWithMongoDBModel from "../model/jokesWithMongoDBModel";
import type { JokeWithMongoDB } from "../types/jokes";

export const getAllJokes = async (): Promise<JokeWithMongoDB[] | Error> => {
  try {
    const jokes = await jokesWithMongoDBModel.getAllJokesCollection();
    if (!jokes) {
      return new Error("No jokes found");
    }
    return jokes;
  } catch (error) {
    return new Error("Failed to get all jokes", { cause: error });
  }
};

export const getRandomJoke = async (): Promise<JokeWithMongoDB | null | Error> => {
  const jokes = await getAllJokes();
  if (!jokes || jokes instanceof Error) {
    return null;
  }
  const jokesArray = Array.isArray(jokes) ? jokes : [];
  const randomIndex = Math.floor(Math.random() * jokesArray.length);
  const randomJoke = jokesArray[randomIndex];
  
  if (!randomJoke) {
    return new Error("No random joke found with index: " + randomIndex);
  }
  return randomJoke;
};

export const getJokeById = async (id: string): Promise<JokeWithMongoDB | Error> => {
  try {
    const joke = await jokesWithMongoDBModel.getJokeById(id);
    if (!joke) {
      return new Error("JokeWithMongoDB not found");
    }
    return joke;
  } catch (error) {
    return new Error("Failed to get joke by id", { cause: error });
  }
};

export const createJoke = async (
  jokeToInsert: JokeWithMongoDB,
): Promise<InsertOneResult<JokeWithMongoDB> | Error> => {
  try {
    const result = await jokesWithMongoDBModel.createJoke(jokeToInsert);
    if (!result) {
      return new Error("Failed to insert joke");
    }
    return result;
  } catch (error) {
    return new Error("Failed to insert joke", { cause: error });
  }
};

export const createManyJokes = async (
  jokesToInsert: JokeWithMongoDB[],
): Promise<InsertManyResult<JokeWithMongoDB> | Error> => {
  try {
    const result = await jokesWithMongoDBModel.createManyJokes(jokesToInsert);
    if (!result) {
      return new Error("Failed to insert many jokes");
    }
    return result;
  } catch (error) {
    return new Error("Failed to insert many jokes", { cause: error });
  }
};
