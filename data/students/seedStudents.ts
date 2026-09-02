import { seedStudents } from "../../controllers/studentController";
import { closeMongoDB } from "./studentDb";

const seed = async () => {
  await seedStudents();
  await closeMongoDB();
  process.exit(0);
};

seed().catch(async (error) => {
  console.error(error, "seed error");
  await closeMongoDB();
  process.exit(1);
});
