import express from "express";
import { WebSocketServer } from "ws";
import * as http from "http";

export const api_server = express();
export const http_server = http.createServer();
export const ws_server = new WebSocketServer({ server: http_server });
