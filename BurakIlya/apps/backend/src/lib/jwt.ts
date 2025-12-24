import jwt from "jsonwebtoken";
import { Role } from "@prisma/client";

const secretFromEnv = process.env.JWT_SECRET;
if (!secretFromEnv) {
  throw new Error("JWT_SECRET is not set");
}
const JWT_SECRET: string = secretFromEnv;

export type JwtPayload = {
  userId: string;
  role: Role;
};

export function signAccessToken(payload: JwtPayload) {
  return jwt.sign(payload, JWT_SECRET, { expiresIn: "1h" });
}

export function verifyAccessToken(token: string): JwtPayload {
  const decoded = jwt.verify(token, JWT_SECRET);
  if (!decoded || typeof decoded !== "object") {
    throw new Error("Invalid token");
  }

  const { userId, role } = decoded as JwtPayload;
  if (!userId || !role) {
    throw new Error("Invalid token payload");
  }

  return { userId, role };
}
