import express from "express";
import cors from "cors";
import bodyParser from "body-parser";
import WebSocket, { WebSocketServer } from "ws";
import * as http from "http";
import { API_PORT, WSS_PORT } from "./constants";

const app = express();
const server = http.createServer();
const wsServer = new WebSocketServer({ server });

app.use(cors());
app.use(bodyParser.urlencoded({ extended: true }));

app.post("/messages", (req, res) => {
  wsServer.clients.forEach(function each(client) {
    if (client.readyState === WebSocket.OPEN) {
      client.send(req.body.content);
    }
  });

  res.status(200).send();
});

app.listen(API_PORT, () => {
  console.log(`Server is running on port ${API_PORT}`);
});

server.listen(WSS_PORT, () => {
  console.log(`WebSocket server is running on port ${WSS_PORT}`);
});

wsServer.on("connection", (ws, req) => {
  console.log("Client connected", req.url);

  ws.on("close", () => console.log("Client disconnected"));
});
