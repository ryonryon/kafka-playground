import cookieParser from "cookie-parser";
import cors from "cors";
import bodyParser from "body-parser";
import { checkAuth } from "./Auth/checkAuth";
import { login } from "./Auth/login";
import { getChats } from "./Chat/getChats";
import { getMessages } from "./Message/getMessages";
import { postMessage } from "./Message/postMessage";
import {
  API_PORT,
  KAFKA_CLIENT_ID,
  KAFKA_PORT,
  KAFKA_TOPIC,
  WSS_PORT,
} from "./constants";
import { api_server, http_server, ws_server } from "./servers";
import { kafka } from "./kafka";

api_server.use(cors());
api_server.use(bodyParser.urlencoded({ extended: true }));
api_server.use(cookieParser());

/*
 * API routes
 */
api_server.post("/login", login);
api_server.get("/chats", checkAuth, getChats);
api_server.get("/:group_id/messages", checkAuth, getMessages);
api_server.post("/:group_id/messages", checkAuth, postMessage);

api_server.listen(API_PORT, () => {
  console.log(`Server is running on port ${API_PORT}`);
});

http_server.listen(WSS_PORT, () => {
  console.log(`WebSocket server is running on port ${WSS_PORT}`);
});

const consumer = kafka.consumer({ groupId: "test-group" });
ws_server.on("connection", async (ws, req) => {
  console.log("Client connected", req.url);
  await consumer.connect();
  await consumer.subscribe({ topic: KAFKA_TOPIC, fromBeginning: false });

  await consumer.run({
    eachMessage: async ({ topic, partition, message }) => {
      ws.send(
        JSON.stringify({
          topic,
          partition,
          key: message.key.toString(),
          value: message.value.toString(),
        })
      );
    },
  });

  ws.on("close", () => {
    console.log("Client disconnected");
  });
});
