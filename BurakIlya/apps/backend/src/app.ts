import express from "express";
import cors from "cors";
import helmet from "helmet";
import authRouter from "./routes/auth";
import usersRouter from "./routes/users";
import categoriesRouter from "./routes/categories";
import requestsRouter from "./routes/requests";
import volunteersRouter from "./routes/volunteers";
import assignmentsRouter from "./routes/assignments";
import reviewsRouter from "./routes/reviews";
import { errorHandler } from "./middleware/error-handler";

export function createApp() {
  const app = express();

  app.use(helmet());
  app.use(cors());
  app.use(express.json());

  app.get("/health", (_req, res) => {
    res.status(200).json({ status: "ok" });
  });

  app.use("/auth", authRouter);
  app.use("/users", usersRouter);
  app.use("/categories", categoriesRouter);
  app.use("/requests", requestsRouter);
  app.use("/volunteers", volunteersRouter);
  app.use("/assignments", assignmentsRouter);
  app.use("/reviews", reviewsRouter);

  app.use((req, res) => {
    res.status(404).json({ status: "error", error: { message: "Not found", path: req.path } });
  });

  app.use(errorHandler);

  return app;
}
