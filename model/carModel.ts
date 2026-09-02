import { connectToCarsDb } from "../data/cars/carsDb";

export type Car = {
  name: string;
  brand: string;
  color: string;
};

const getCarsCollection = async () => {
  const client = await connectToCarsDb();
  if (!client) {
    throw new Error("Failed to connect to MongoDB");
  }
  return client.db("trainingDB").collection<Car>("cars");
};

export const getAllCars = async () => {
  const collection = await getCarsCollection();
  return collection.find().toArray();
};

export const insertOneCar = async (car: Car) => {
  const collection = await getCarsCollection();
  return collection.insertOne(car);
};

export const insertManyCars = async (cars: Car[]) => {
  const collection = await getCarsCollection();
  return collection.insertMany(cars, { ordered: true });
};
