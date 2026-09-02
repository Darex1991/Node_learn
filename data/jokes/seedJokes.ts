import jokes from "./jokes.json";
import { closeMongoClient, insertManyJokes } from "./jokesDb";

const seed = async () => {
  await insertManyJokes(
    jokes.map((joke) => ({ joke: joke.text })),
    { ordered: true },
  );
  await closeMongoClient();
  process.exit(0);
};

seed().catch(async (error) => {
  console.error(error, "seed error");
  await closeMongoClient();
  process.exit(1);
});
