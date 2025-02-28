import { NextApiRequest, NextApiResponse } from "next";
import { Server as SocketIOServer } from "socket.io";
import { Server as HTTPServer } from "http";
import { Socket } from "net"; 
import { subscriber } from "../lib/redis";

interface CustomResponse extends NextApiResponse {
  socket: Socket & { 
    server: HTTPServer & { io?: SocketIOServer } 
  };
}

export default function handler(req: NextApiRequest, res: CustomResponse) {
  if (!res.socket?.server) {
    return res.status(500).json({ error: "Server is not available" });
  }

  let io: SocketIOServer;
  if (!res.socket.server.io) {
    console.log("Initializing WebSocket server...");

    io = new SocketIOServer(res.socket.server, {
      path: "/api/socket",
      cors: {
        origin: "*",
        methods: ["GET", "POST"],
      },
    });

    res.socket.server.io = io;
  } else {
    io = res.socket.server.io;
  }

  subscriber.subscribe("collaboration", (err: any, count: any) => {
    if (err) {
      console.error("Redis Subscribe Error:", err);
      return;
    }
    console.log(`Subscribed to ${count} Redis channels.`);
  });

  subscriber.on("message", (channel: string, message: string) => {
    if (channel === "collaboration") {
      io.emit("collaborationUpdate", JSON.parse(message)); 
    }
  });

  res.status(200).json({ success: true, message: "Subscribed to collaboration updates" });
}
