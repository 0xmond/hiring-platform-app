import express from "express";
import bootstrap from "./src/app.controller.js";
import { initSocket } from "./src/socket.io/initSocket.js";
import cron from "node-cron";
import { otpCronDeletion } from "./src/modules/auth/otp.cron.js";

const app = express();

bootstrap(app, express);

cron.schedule("* */6 * * * *", otpCronDeletion);

const port = process.env.PORT || 3001;
const server = app.listen(port, () => {
  console.warn("Server is running on port", port);
});

const io = initSocket(server);
