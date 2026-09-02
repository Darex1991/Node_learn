import http from "http";
import {
  getAllJokes,
  getJokeById,
  asyncRandomJoke,
} from "../controllers/jokeController";
import { API_CONTENT_TYPE } from "../utils/httpStatic";

export const getJokes = async (
  req: http.IncomingMessage,
  res: http.ServerResponse,
) => {
  if (req.url === "/api/jokes" && req.method === "GET") {
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
    const id = req.url.match(/^\/api\/jokes\/(\d+)$/)?.[1];
    const joke = id ? await getJokeById(id) : null;
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
  }
};
