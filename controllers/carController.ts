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
      brand: "Brand 3",
      color: "Color 3",
    });
    await carModel.insertOneCar({
      name: "Car 2",
      brand: "Brand 2",
      color: "Color 2",
    });
    await carModel.insertManyCars([
      { name: "Car 3", brand: "Brand 3", color: "Color 3" },
      { name: "Car 4", brand: "Brand 4", color: "Color 4" },
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
