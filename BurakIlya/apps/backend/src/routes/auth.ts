import { Router } from "express";
import { prisma } from "../lib/prisma";
import { hashPassword, verifyPassword } from "../lib/hash";
import { signAccessToken } from "../lib/jwt";
import { AppError } from "../middleware/error-handler";
import { z } from "zod";

const router = Router();

const registerSchema = z.object({
  email: z.string().email(),
  username: z.string().min(3).max(50),
  password: z.string().min(6).max(100)
});

const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6)
});

router.post("/register", async (req, res, next) => {
  try {
    const data = registerSchema.parse(req.body);

    const existing = await prisma.user.findFirst({
      where: { OR: [{ email: data.email }, { username: data.username }] },
      select: { id: true }
    });

    if (existing) {
      throw new AppError(409, "User already exists", "user_exists");
    }

    const passwordHash = await hashPassword(data.password);

    const user = await prisma.user.create({
      data: {
        email: data.email,
        username: data.username,
        passwordHash,
        role: "user"
      },
      select: { id: true, email: true, username: true, role: true }
    });

    const accessToken = signAccessToken({ userId: user.id, role: user.role });

    return res.status(201).json({ status: "ok", data: { user, accessToken } });
  } catch (err) {
    next(err);
  }
});

router.post("/login", async (req, res, next) => {
  try {
    const data = loginSchema.parse(req.body);

    const user = await prisma.user.findUnique({
      where: { email: data.email },
      select: { id: true, email: true, username: true, role: true, passwordHash: true }
    });

    if (!user) {
      throw new AppError(401, "Invalid credentials", "invalid_credentials");
    }

    const valid = await verifyPassword(data.password, user.passwordHash);
    if (!valid) {
      throw new AppError(401, "Invalid credentials", "invalid_credentials");
    }

    const accessToken = signAccessToken({ userId: user.id, role: user.role });
    const { passwordHash, ...safeUser } = user;

    return res.status(200).json({ status: "ok", data: { user: safeUser, accessToken } });
  } catch (err) {
    next(err);
  }
});

export default router;
