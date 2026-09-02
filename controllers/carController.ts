import * as carModel from "../model/carModel";

export const getAllCars = async () => {
  try {
    return await carModel.getAllCars();
  } catch (error) {
    return error;
  }
};

export const seedCars = async () => {
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
    return await carModel.getAllCars();
  } catch (error) {
    return error;
  }
};
