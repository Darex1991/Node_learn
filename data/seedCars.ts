import { insertCars, closeMongoClient } from "./carsDb";

const seed = async () => {
  await insertCars();
  await closeMongoClient();
  process.exit(0);
};

seed().catch(async (error) => {
  console.error(error, "seed error");
  await closeMongoClient();
  process.exit(1);
});
