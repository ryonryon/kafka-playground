import { PrismaClient } from "@prisma/client";
import { Request, Response } from "express";
import WebSocket from "ws";
import { ws_server } from "../servers";

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

  // ws_server.clients.forEach(function each(client) {
  //   if (client.readyState === WebSocket.OPEN) {
  //     client.send(content);
  //   }
  // });

  res.status(200).send({
    message,
  });
}
