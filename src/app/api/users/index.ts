import { NextApiRequest, NextApiResponse } from "next";
import { requireAuth } from "@/middleware/requireAuth";
import UserModels from "@/models/User.models";
import { connectDb } from "../lib/mongodb";

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  await connectDb();
  const user = (req as any).user;

  if (user.role !== "admin") {
    return res.status(403).json({ error: "Access denied" });
  }

  if (req.method === "GET") {
    try {
      const users = await UserModels.find().select("-password");
      return res.status(200).json(users);
    } catch (error) {
      return res.status(500).json({ error: "Internal Server Error" });
    }
  }

  return res.status(405).json({ error: "Method Not Allowed" });
};

export default requireAuth(handler);
