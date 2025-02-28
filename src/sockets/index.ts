import { NextApiRequest } from "next";
import { Server } from "socket.io";

export default function handler(req: NextApiRequest, res: any){
    if(!res.socket?.server.io){
        console.log("setting up websockets server....")
    }

    const io = new Server(res.socket.server, {
      path: "src/sockets/index.ts",
      addTrailingSlash: false,
      cors: {
        origin: "*",
        methods: ["GET", "POST"],
      }
    })

    res.socket.server.io = io;

    io.on("connection", (socket) => {
        console.log("web sockets new connection ", socket.id);

        socket.on("newNotification", (data) => {
            console.log("Notification Received:", data);
            io.emit("notification", data);
        })

        socket.on("disconnect", () => {
            console.log("Client Disconnected:", socket.id);
          });
    })

    res.end()
}