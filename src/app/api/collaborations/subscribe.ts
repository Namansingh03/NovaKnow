import { NextApiRequest, NextApiResponse } from "next";
import { Server as SocketIOServer } from "socket.io";
import { Server as HTTPServer } from "http";
import { subscriber } from "../lib/redis";
import { Socket } from "net"; 

interface CustomResponse extends NextApiResponse {
  socket: Socket & { 
      server: HTTPServer & { io?: SocketIOServer } 
    };
}

export default function handler(req: NextApiRequest, res: CustomResponse) {
  if (!res.socket?.server) {
    return res.status(500).json({ error: "Server is not available" });
  }

  if (!res.socket.server.io) {
    console.log("Setting up WebSocket server...");

    const io = new SocketIOServer(res.socket.server, {
      path: "/api/socket",
      cors: {
        origin: "*",
        methods: ["GET", "POST"],
      },
    });

    res.socket.server.io = io;

    subscriber.subscribe("collaboration", (err: any, count: any) => {
      if (err) console.error("Redis Subscribe Error:", err);
      console.log(`✅ Subscribed to ${count} Redis channels.`);
    });

    subscriber.on("message", (channel: any, message: any) => {
      if (channel === "collaboration") {
        io.emit("collaborationUpdate", JSON.parse(message)); 
      }
    });
  }

  res.end();
}
