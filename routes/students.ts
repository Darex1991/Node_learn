import http from "http";
import { getAllStudents } from "../controllers/studentController";
import { API_CONTENT_TYPE } from "../utils/httpStatic";

export const getStudents = async (req: http.IncomingMessage, res: http.ServerResponse) => {
    console.log(req.url, "req.url");
    console.log(req.method, "req.method");
    if (req.url === "/api/students" && req.method === "GET") {
        const students = await getAllStudents();
        if (students) {
            res.writeHead(200, API_CONTENT_TYPE);
            res.end(JSON.stringify(students));
        } else {
            res.writeHead(404, API_CONTENT_TYPE);
            res.end(JSON.stringify({ message: "No students found" }));
        }
    }
}