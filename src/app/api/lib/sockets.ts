import { Server as SocketIOServer } from "socket.io";

let io: SocketIOServer | null = null;

export const initializeSocket = (server: any) => {
  if (!io) {
    io = new SocketIOServer(server, {
      cors: { origin: "*", methods: ["GET", "POST"] },
    });
    console.log("🔌 WebSocket Server Initialized");
  }
  return io;
};

export const getSocket = () => {
  if (!io) throw new Error("WebSocket not initialized");
  return io;
};
