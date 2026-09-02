import jokes from "../data/jokes.json" with { type: "json" };
type Joke = {
  id: number;
  joke: string;
};
// import type { Joke } from "../types/joke";

export const getAllJokes = (): Promise<Joke[]> => {
  return new Promise((resolve, reject) => {
    resolve(jokes);
  });
};

export const getById = (id: string): Promise<Joke> => {
  console.log(id, "id");
  return new Promise((resolve, reject) => {
    const joke = jokes.find((joke) => joke.id === parseInt(id));
    if (joke) {
      resolve(joke);
    } else {
      reject(new Error("Joke not found"));
    }
    console.log(joke, "joke");
  });
};
