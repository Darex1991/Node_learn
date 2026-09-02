import * as jokeModel from "../model/jokeModel";

export const getAllJokes = async () => {
  try {
    const jokes = await jokeModel.getAllJokes();
    return jokes;
  } catch (error) {
    return error;
  }
};

export const getJokeById = async (id: string) => {
  try {
    const joke = await jokeModel.getById(id);
    return joke;
  } catch (error) {
    return error;
  }
};

export const asyncRandomJoke = async () => {
  try {
    const jokes = await getAllJokes();
    if (jokes) {
      return jokes[Math.floor(Math.random() * jokes.length)];
    } else {
      return null;
    }
  } catch (error) {
    console.error(error);
    return error;
  }
};
