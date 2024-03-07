import { PrismaClient } from "@prisma/client";
import { Request, Response } from "express";

const prisma = new PrismaClient();
export async function getMessages(
  req: Request<{ group_id: string }>,
  res: Response
) {
  const group_id = Number(req.params.group_id);

  const messages = await prisma.message.findMany({
    where: {
      group_id,
    },
    include: {
      User: true,
    },
    orderBy: {
      created_at: "desc",
    },
  });

  res.status(200).send({
    groups: messages.map((m) => ({
      message_id: m.message_id,
      content: m.content,
      created_at: m.created_at,
      user_id: m.sender_id,
      user_name: m.User.name,
    })),
  });
}
