import { PrismaClient } from "@prisma/client";
import { Request, Response } from "express";
import * as bcrypt from "bcrypt";
import { sign } from "jsonwebtoken";

const prisma = new PrismaClient();

export async function login(
  req: Request<
    {},
    {
      email: string;
      password: string;
    }
  >,
  res: Response
) {
  const { email, password } = req.body;

  const loggingInUser = await prisma.user.findUnique({
    where: {
      email,
    },
  });

  if (!loggingInUser) {
    res.status(401).send({
      message: "Invalid email or password",
    });
    return;
  }

  const isPasswordCorrect = await bcrypt.compare(
    password,
    loggingInUser.password
  );

  if (!isPasswordCorrect) {
    res.status(401).send({
      message: "Invalid email or password",
    });
    return;
  }

  const jwtPayload = {
    id: loggingInUser.user_id,
  };

  const token = sign(jwtPayload, "SECRET_KEY", {
    expiresIn: "7d",
  });

  res.cookie("token", token, {
    httpOnly: true,
    secure: true,
    sameSite: "strict",
  });

  res.status(200).send({
    user_id: loggingInUser.user_id,
    token,
  });
}
