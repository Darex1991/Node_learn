import http from "http";
import { serviceStaticFiles } from "./utils/serverStatic";
import { closeMongoDB, connectToMongoDB } from "./data/students/studentDb";
import { closeMongoClient, connectToCarsDb } from "./data/cars/carsDb";
import { PORT, parseRequestBody } from "./utils/httpStatic";
import { getJokes } from "./routes/jokes";
import { getJokesWithMongoDB } from "./routes/jokesWithMongoDB";
import { getCars } from "./routes/cars";
import { getStudents } from "./routes/students";
import {
  asyncRandomQuote,
  getQuotes,
  prepareQuotes,
  removeQuote,
  updateQuote,
} from "./controllers/quoteController";
import type { ObjectId } from "mongodb";
import type { Quote } from "./types/quotes";

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
    } else if (req.url === "/api/quotes" && req.method === "GET") {
      const quotes = await getQuotes();
      if (quotes) {
        res.writeHead(200, { "Content-Type": "application/json" });
        res.end(JSON.stringify(quotes));
      } else {
        res.writeHead(404, { "Content-Type": "application/json" });
        res.end(JSON.stringify({ message: "No quotes found" }));
      }
    } else if (req.url === "/api/quotes/random" && req.method === "GET") {
      const quotes = await asyncRandomQuote();
      console.log("quotes", quotes);
      if (quotes) {
        res.writeHead(200, { "Content-Type": "application/json" });
        res.end(JSON.stringify(quotes));
      } else {
        res.writeHead(404, { "Content-Type": "application/json" });
        res.end(JSON.stringify({ message: "No quotes found" }));
      }
    } else if (req.url?.match("/api/quotes/[a-f0-9]{24}")) {
      const id = req.url?.split("/")[3];

      if (id) {
        if (req.method === "DELETE") {
          const quote = await removeQuote(id);
          if (quote) {
            res.writeHead(200, { "Content-Type": "application/json" });
            res.end(JSON.stringify(quote));
          } else {
            res.writeHead(404, { "Content-Type": "application/json" });
            res.end(JSON.stringify({ message: "Quote not found" }));
          }
        } else if (req.method === "PUT") {
          const body = await parseRequestBody(req);
          if (body) {
            const quote = await updateQuote(id, body as Omit<Quote, "_id">);
            if (quote) {
              res.writeHead(200, { "Content-Type": "application/json" });
              res.end(JSON.stringify(quote));
            } else {
              res.writeHead(404, { "Content-Type": "application/json" });
              res.end(JSON.stringify({ message: "Quote not found" }));
            }
          } else {
            res.writeHead(400, { "Content-Type": "application/json" });
            res.end(JSON.stringify({ message: "Invalid body" }));
          }
        }
      } else {
        res.writeHead(400, { "Content-Type": "application/json" });
        res.end(JSON.stringify({ message: "Invalid ID" }));
      }
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
