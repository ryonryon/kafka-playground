import { Kafka } from "kafkajs";
import { KAFKA_CLIENT_ID, KAFKA_PORT } from "./constants";

export const kafka = new Kafka({
  clientId: KAFKA_CLIENT_ID,
  brokers: [`localhost:${KAFKA_PORT}`],
});
