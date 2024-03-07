import { PrismaClient } from "@prisma/client";
import { Request, Response } from "express";
import { KAFKA_TOPIC } from "../constants";
import { kafka } from "../kafka";

const producer = kafka.producer();

const prisma = new PrismaClient();
export async function postMessage(
  req: Request<
    { group_id: string },
    {
      content: string;
    }
  >,
  res: Response
) {
  const user_id = Number(req.secret);
  const group_id = Number(req.params.group_id);
  const content = req.body.content;

  const group = await prisma.group.findUnique({
    where: {
      group_id,
    },
    include: {
      GroupMember: true,
    },
  });

  if (!group) {
    res.status(404).send({
      message: "Group not found",
    });

    return;
  }

  if (!group.GroupMember.some((member) => member.member_id === user_id)) {
    res.status(403).send({
      message: "You are not a member of this group",
    });

    return;
  }

  const message = await prisma.message.create({
    data: {
      content,
      sender_id: user_id,
      group_id,
    },
  });

  await producer.connect();

  await producer.send({
    topic: KAFKA_TOPIC,
    messages: [
      {
        key: String(group_id),
        value: JSON.stringify({
          type: "message",
          message: {
            message_id: message.message_id,
            content: message.content,
            created_at: message.created_at,
            user_id: message.sender_id,
          },
        }),
      },
    ],
  });

  await producer.disconnect();

  res.status(200).send({
    message,
  });
}
