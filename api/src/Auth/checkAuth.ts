import { NextFunction, Request, Response } from "express";
import { verify, JwtPayload } from "jsonwebtoken";

export function checkAuth(
  request: Request,
  response: Response,
  next: NextFunction
) {
  try {
    const { token } = request.cookies;

    if (!token) throw new Error();

    const { id } = verify(token, "SECRET_KEY") as JwtPayload;
    request.secret = id;

    next();
  } catch {
    request.secret = undefined;
    response.clearCookie("token");
    response.status(401).send("Authentication failed!🥹");
  }
}
