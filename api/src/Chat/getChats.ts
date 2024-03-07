import { PrismaClient } from "@prisma/client";
import { Request, Response } from "express";

const prisma = new PrismaClient();
export async function getChats(req: Request, res: Response) {
  const user_id = Number(req.secret!);

  const groups = await prisma.groupMember.findMany({
    where: {
      member_id: user_id,
    },
    include: {
      Group: true,
    },
  });

  res.status(200).send({
    groups: groups.map((group) => group.Group),
  });
}
