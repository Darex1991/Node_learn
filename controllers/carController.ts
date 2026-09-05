import type { WithId } from "mongodb";
import * as carModel from "../model/carModel";
import type { Car } from "../types/cars";

export const getAllCars = async (): Promise<WithId<Car>[] | Error> => {
  try {
    const cars = await carModel.getAllCars();
    if (!cars) {
      return new Error("No cars found");
    }
    return cars;
  } catch (error) {
    return new Error("Failed to get all cars", { cause: error });
  }
};

export const seedCars = async (): Promise<WithId<Car>[] | Error> => {
  try {
    await carModel.insertOneCar({
      name: "Car 1",
      brand: "Ford",
      color: "Red",
    });
    await carModel.insertOneCar({
      name: "Car 2",
      brand: "Ford",
      color: "Blue",
    });
    await carModel.insertManyCars([
      { name: "Car 3", brand: "Ford", color: "Green" },
      { name: "Car 4", brand: "Ford", color: "Yellow" },
    ]);

    const cars = await carModel.getAllCars();
    if (!cars) {
      return new Error("No cars found");
    }

    return cars;
  } catch (error) {
    return new Error("Failed to seed cars", { cause: error });
  }
};
