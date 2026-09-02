import type { Collection, InsertManyResult, InsertOneResult, WithId } from "mongodb";
import { connectToCarsDb } from "../data/cars/carsDb";
import type { Car } from "../types/cars";

const getCarsCollection = async (): Promise<Collection<Car> | null> => {
  const client = await connectToCarsDb();
  if (!client) {
    return null;
  }
  return client.db("trainingDB").collection<Car>("cars");
};

export const getAllCars = async (): Promise<WithId<Car>[] | null> => {
  const collection = await getCarsCollection();
  if (!collection) {
    return null;
  }
  return collection.find().toArray();
};

export const insertOneCar = async (
  car: Car,
): Promise<InsertOneResult<Car> | null> => {
  const collection = await getCarsCollection();
  if (!collection) {
    return null;
  }
  return collection.insertOne(car);
};

export const insertManyCars = async (
  cars: Car[],
): Promise<InsertManyResult<Car> | null> => {
  const collection = await getCarsCollection();
  if (!collection) {
    return null;
  }
  return collection.insertMany(cars, { ordered: true });
};
