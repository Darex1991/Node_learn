import http from "http";
import { addGame, getAllGames } from "../controllers/gamesController";
import { API_CONTENT_TYPE } from "../utils/httpStatic";

export const getGames = async (
  req: http.IncomingMessage,
  res: http.ServerResponse,
) => {
  console.log(req.url, "req.url");
  console.log(req.method, "req.method");
  if (req.url === "/api/games" && req.method === "GET") {
    console.log("getAllGames");
    const games = await getAllGames();
    console.log(games, "games");
    if (games) {
      console.log("games found");
      res.writeHead(200, API_CONTENT_TYPE);
      res.end(JSON.stringify(games));
    } else {
      res.writeHead(404, API_CONTENT_TYPE);
      res.end(JSON.stringify({ message: "No games found" }));
    }
  } 
  else if (req.url === "/api/games/add" && req.method === "GET") {
    const game = await addGame();
    if (game) {
      console.log("game added");
      res.writeHead(200, API_CONTENT_TYPE);
      res.end(JSON.stringify(game));
    }
  }
  else {
    res.writeHead(404, API_CONTENT_TYPE);
    res.end(JSON.stringify({ message: "Invalid request" }));
  }
};
