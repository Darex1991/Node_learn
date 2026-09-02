import fs from "fs";
import path from "path";
import url from "url";
import http from "http";

const mimeTypes = {
  html: "text/html",
  css: "text/css",
  js: "text/javascript",
  json: "application/json",
  png: "image/png",
  jpg: "image/jpg",
  gif: "image/gif",
};

const IGNORED_PATHS = [
  "/favicon.ico",
  "/.well-known/appspecific/com.chrome.devtools.json",
];

export const serviceStaticFiles = (
  req: http.IncomingMessage,
  res: http.ServerResponse,
) => {
  const baseURL = req.url;

  if (!baseURL || (baseURL && IGNORED_PATHS.includes(baseURL))) {
    res.writeHead(204);
    res.end();
    return;
  }

  const filePath = baseURL.startsWith("/build/")
    ? path.join(import.meta.dirname, "../", baseURL)
    : path.join(import.meta.dirname, "../", "static", baseURL);

  const extension: string = path.extname(baseURL).slice(1);

  const contentType =
    extension in mimeTypes
      ? mimeTypes[extension as keyof typeof mimeTypes]
      : "text/plain";

  if (fs.existsSync(filePath)) {
    if (fs.statSync(filePath).isDirectory()) {
      const indexPath = path.join(filePath, "index.html");
      console.log({ indexPath }, "indexPath");
      if (fs.existsSync(indexPath)) {
        res.writeHead(200, { "Content-Type": mimeTypes.html });
        res.end(fs.readFileSync(indexPath));
        return;
      } else {
        res.writeHead(404, { "Content-Type": "text/plain" });
        res.end("File not found");
        return;
      }
    } else {
      res.writeHead(200, { "Content-Type": contentType });
      res.end(fs.readFileSync(filePath));
      return;
    }
  } else {
    res.writeHead(404, { "Content-Type": "text/plain" });
    res.end("File not found");
    return;
  }
};
