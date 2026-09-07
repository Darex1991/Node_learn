import type { ObjectId } from "mongodb";

export type Quote = {
  _id: ObjectId;
  quote: string;
  author: string;
};
