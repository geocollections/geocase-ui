import { createServer } from "node:http";
const server = createServer((request, response) => {
  const url = new URL(request.url, "http://127.0.0.1");
  response.writeHead(Number(url.searchParams.get("status")) || 200, {
    "content-type": "application/json",
  });
  response.end(
    JSON.stringify({
      path: url.pathname,
      query: url.search,
      params: [...url.searchParams],
    }),
  );
});
server.listen(3101, "127.0.0.1");
process.on("SIGTERM", () => server.close());
