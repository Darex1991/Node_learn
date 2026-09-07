import type http from "http";

export const PORT = 8080;
export const API_CONTENT_TYPE = { "Content-Type": "application/json" };

export const parseRequestBody = <T = unknown>(
  req: http.IncomingMessage,
): Promise<T> => {
  return new Promise((resolve, reject) => {
    const chunks: Buffer[] = [];
    req.on("data", (chunk) => chunks.push(chunk));
    req.on("end", () => {
      const raw = Buffer.concat(chunks).toString("utf-8");
      if (!raw) {
        resolve({} as T);
        return;
      }
      try {
        resolve(JSON.parse(raw));
      } catch (error) {
        reject(error);
      }
    });
    req.on("error", reject);
  });
};
