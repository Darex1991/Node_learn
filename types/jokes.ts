import type { ObjectId } from "mongodb";

export type Joke = {
  id: number;
  joke: string;
};

export type JokeWithMongoDB = {
  _id: ObjectId;
  joke: string;
};