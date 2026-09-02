import jokes from "../data/jokes/jokes.json" with { type: "json" };
type Joke = {
  id: number;
  text: string;
};

export const getAllJokes = (): Promise<Joke[]> => {
  return new Promise((resolve, reject) => {
    resolve(jokes.map((joke) => ({ id: joke.id, text: joke.text })));
  });
};

export const getById = (id: string): Promise<Joke> => {
  return new Promise((resolve, reject) => {
    const joke = jokes.find((joke) => joke.id === parseInt(id));
    if (joke) {
      resolve({ id: joke.id, text: joke.text });
    } else {
      reject(new Error("Joke not found"));
    }
  });
};
