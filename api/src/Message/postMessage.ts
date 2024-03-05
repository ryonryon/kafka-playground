import { Request, Response } from "express";
import { ws_server } from "../servers";
import WebSocket from "ws";

export function postMessage(req: Request, res: Response) {
  ws_server.clients.forEach(function each(client) {
    if (client.readyState === WebSocket.OPEN) {
      client.send(req.body.content);
    }
  });

  res.status(200).send();
}
