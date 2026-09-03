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
  const indexBuildPath = path.join(
    import.meta.dirname,
    "../",
    "static",
    "index.html",
  );
  const menuBarPath = path.join(
    import.meta.dirname,
    "../",
    "static",
    "menu_bar.html",
  );

  const extension: string = path.extname(baseURL).slice(1);

  const contentType =
    extension in mimeTypes
      ? mimeTypes[extension as keyof typeof mimeTypes]
      : "text/plain";

  if (fs.existsSync(filePath)) {
    console.log({ filePath }, "filePath");
    if (fs.statSync(filePath).isDirectory()) {
      if (!baseURL.endsWith("/")) {
        res.writeHead(301, { Location: `${baseURL}/` });
        res.end();
        return;
      }

      const indexPath = path.join(filePath, "index.html");

      if (fs.existsSync(indexPath)) {
        res.writeHead(200, { "Content-Type": mimeTypes.html });

        let content = fs.readFileSync(indexBuildPath, { encoding: "utf-8" });
        if (indexBuildPath === indexPath) {
          content = content.replace("{#body_content#}", "");
        } else {
          const bodyContent = fs.readFileSync(indexPath, { encoding: "utf-8" });
          content = content.replace("{#body_content#}", bodyContent);
        }

        const headPath = path.join(filePath, "head.html");
        if (fs.existsSync(headPath)) {
          const headFromPath = fs.readFileSync(headPath, { encoding: "utf-8" });
          content = content.replace("{#head#}", headFromPath);
        } else {
          content = content.replace("{#head#}", "");
        }

        if (fs.existsSync(menuBarPath)) {
          const menuBarFromPath = fs.readFileSync(menuBarPath, {
            encoding: "utf-8",
          });
          content = content.replace("{#menu_bar#}", menuBarFromPath);
        }

        res.end(content);
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
