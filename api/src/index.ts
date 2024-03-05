import cors from "cors";
import bodyParser from "body-parser";
import { api_server, http_server, ws_server } from "./servers";
import { API_PORT, WSS_PORT } from "./constants";
import { postMessage } from "./Message/postMessage";

api_server.use(cors());
api_server.use(bodyParser.urlencoded({ extended: true }));

/*
 * API routes
 */
api_server.post("/messages", postMessage);

api_server.listen(API_PORT, () => {
  console.log(`Server is running on port ${API_PORT}`);
});

http_server.listen(WSS_PORT, () => {
  console.log(`WebSocket server is running on port ${WSS_PORT}`);
});

ws_server.on("connection", (ws, req) => {
  console.log("Client connected", req.url);

  ws.on("close", () => console.log("Client disconnected"));
});
