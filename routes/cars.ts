import http from "http";
import { getAllCars } from "../controllers/carController";
import { API_CONTENT_TYPE } from "../utils/httpStatic";

export const getCars = async (req: http.IncomingMessage, res: http.ServerResponse) => {
    console.log(req.url, "req.url");
    console.log(req.method, "req.method");
    if (req.url === "/api/cars" && req.method === "GET") {
        const cars = await getAllCars();
        if (cars) {
            res.writeHead(200, API_CONTENT_TYPE);
            res.end(JSON.stringify(cars));
        } else {
            res.writeHead(404, API_CONTENT_TYPE);
            res.end(JSON.stringify({ message: "No cars found" }));
        }
    }
}