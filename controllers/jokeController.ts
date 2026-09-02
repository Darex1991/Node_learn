import * as jokeModel from "../model/jokeModel";
import type { Joke } from "../types/jokes";

export const getAllJokes = async (): Promise<Joke[] | Error> => {
  try {
    const jokes = await jokeModel.getAllJokes();
    if (!jokes) {
      return new Error("No jokes found");
    }
    return jokes;
  } catch (error) {
    return new Error("Failed to get all jokes", { cause: error });
  }
};

export const getJokeById = async (id: string): Promise<Joke | null | Error> => {
  try {
    const joke = await jokeModel.getById(id);
    if (!joke) {
      return new Error("Joke not found");
    }
    return joke;
  } catch (error) {
    return new Error("Failed to get joke by id", { cause: error });
  }
};

export const asyncRandomJoke = async (): Promise<Joke | null | Error> => {
  try {
    const jokes = await getAllJokes();
    if (jokes && Array.isArray(jokes)) {
      return jokes[Math.floor(Math.random() * jokes.length)] as Joke;
    } else {
      return new Error("No jokes found");
    }
  } catch (error) {
    console.error(error);
    return new Error("Failed to get random joke", { cause: error });
  }
};
