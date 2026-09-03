import http from "http";
import { serviceStaticFiles } from "./utils/serverStatic";
import { closeMongoDB, connectToMongoDB } from "./data/students/studentDb";
import { closeMongoClient, connectToCarsDb } from "./data/cars/carsDb";
import { PORT } from "./utils/httpStatic";
import { getJokes } from "./routes/jokes";
import { getJokesWithMongoDB } from "./routes/jokesWithMongoDB";
import { getCars } from "./routes/cars";
import { getStudents } from "./routes/students";

const server = http.createServer(
  async (req: http.IncomingMessage, res: http.ServerResponse) => {
    if (req.url && req.url.includes("/api/jokesWithMongoD")) {
      getJokesWithMongoDB(req, res);
    } else if (req.url && req.url.includes("/api/jokes")) {
      getJokes(req, res);
    } else if (req.url && req.url.includes("/api/cars")) {
      getCars(req, res);
    } else if (req.url && req.url.includes("/api/students")) {
      getStudents(req, res);
    } else {
      serviceStaticFiles(req, res);
    }
  },
);

const studentsClient = await connectToMongoDB();
if (!studentsClient) {
  console.error("Failed to connect to MongoDB");
  process.exit(1);
}

const carsClient = await connectToCarsDb();
if (!carsClient) {
  console.error("Failed to connect to MongoDB");
  process.exit(1);
}

server.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

const shutdown = async () => {
  await closeMongoDB();
  await closeMongoClient();
  server.close();
  process.exit(0);
};

process.on("SIGINT", shutdown);
process.on("SIGTERM", shutdown);
