import { Server } from "socket.io";
import { sendJobApplicationNotification } from "./notification/index.js";
import { socketAuth } from "./middleware/authentication.socket.js";

export const initSocket = (server) => {
  const io = new Server(server, {
    cors: { origin: "*" },
  });
  io.use(socketAuth);
  // connection
  io.on("connection", (socket) => {
    console.log("A user connected:", socket.id);

    // listening to >> send notification when apply to job
    socket.on("applyForJob", sendJobApplicationNotification(socket, io));
  });

  return io;
};
