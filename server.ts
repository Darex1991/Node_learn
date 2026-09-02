import http from "http";
import {
  getAllJokes,
  getJokeById,
  asyncRandomJoke,
} from "./controllers/jokeController";
import url from "url";
import { serviceStaticFiles } from "./utils/serverStatic";
import { closeMongoDB, connectToMongoDB, getProcessDb, findStudentByName } from "./data/listdb";
import { closeMongoClient, connectToCarsDb, insertCars } from "./data/carsDb";

const PORT = 8080;
const API_CONTENT_TYPE = { "Content-Type": "application/json" };

const server = http.createServer(
  async (req: http.IncomingMessage, res: http.ServerResponse) => {
    if (req.url === "/api/jokes" && req.method === "GET") {
      console.log("jokes");
      const jokes = await getAllJokes();
      if (jokes) {
        res.writeHead(200, API_CONTENT_TYPE);
        res.end(JSON.stringify(jokes));
      } else {
        res.writeHead(404, API_CONTENT_TYPE);
        res.end(JSON.stringify({ message: "No jokes found" }));
      }
    } else if (
      req.url &&
      req.url.match(/^\/api\/jokes\/(\d+)$/) &&
      req.method === "GET"
    ) {
      console.log(
        url.parse(req.url, true)?.pathname?.split("/jokes/")[1],
        "url.parse(req.url, true)",
      );
      const id = url.parse(req.url, true).query.id;
      const joke = id && typeof id === "string" ? await getJokeById(id) : null;
      if (joke) {
        res.writeHead(200, API_CONTENT_TYPE);
        res.end(JSON.stringify(joke));
      } else {
        res.writeHead(404, API_CONTENT_TYPE);
        res.end(JSON.stringify({ message: "Joke not found" }));
      }
    } else if (req.url === "/api/jokes/random" && req.method === "GET") {
      const joke = await asyncRandomJoke();
      if (joke) {
        res.writeHead(200, API_CONTENT_TYPE);
        res.end(JSON.stringify(joke));
      } else {
        res.writeHead(404, API_CONTENT_TYPE);
        res.end(JSON.stringify({ message: "No joke found" }));
      }
    } else {
      serviceStaticFiles(req, res);
    }

    // if (req.method !== 'GET') {
    //   res.writeHead(404, API_CONTENT_TYPE);
    //   res.end(JSON.stringify({ message: 'Route not found' }));
    // }
  },
);

const mongoClient = await getProcessDb();
if (!mongoClient) {
  console.error("Failed to connect to MongoDB");
  process.exit(1);
}

const cars = await connectToCarsDb();
if (!cars) {
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
