import { globalError } from "./utils/error/global-error.js";
import { notFoundError } from "./utils/error/not-found.js";
import helmet from "helmet";
import cors from "cors";
import { connectDB } from "./db/db.connection.js";
import authRouter from "./modules/auth/auth.controller.js";
import userRouter from "./modules/user/user.controller.js";
import companyRouter from "./modules/company/company.controller.js";
import jobRouter from "./modules/job/job.search.controller.js";
import { createHandler } from "graphql-http/lib/use/express";
import { schema } from "./app.schema.js";

const bootstrap = async (app, express, io) => {
  app.use(helmet());
  app.use(
    cors({
      origin: "http://127.0.0.1:5500",
      methods: "GET,POST,PUT,DELETE",
      credentials: true,
    })
  );
  app.use(express.json());

  await connectDB();

  // auth router
  app.use("/auth", authRouter);

  // user router
  app.use("/user", userRouter);

  // company router
  app.use("/company", companyRouter);

  // job router
  app.use("/job", jobRouter);

  // admin panel
  app.all(
    "/graphql",
    createHandler({
      schema,
      context: (req) => {
        const { authorization } = req.headers;
        return { authorization };
      },
      formatError: (error) => {
        return {
          success: false,
          statusCode: error.originalError?.cause || 500,
          message: error.originalError?.message,
          stach: error.originalError?.stack,
        };
      },
    })
  );

  // not found error handling
  app.all("*", notFoundError);

  // global error handling
  app.use(globalError);
};

export default bootstrap;
