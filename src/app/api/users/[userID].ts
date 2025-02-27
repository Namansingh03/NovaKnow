import { NextApiRequest, NextApiResponse } from "next";
import { requireAuth } from "@/middleware/requireAuth";
import { connectDb } from "../lib/mongodb";
import UserModels from "@/models/User.models";

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  await connectDb();
  const { userId } = req.query;
  const user = (req as any).user;

  if (!userId) {
    return res.status(400).json({ error: "User ID is required" });
  }

  if (req.method === "GET") {
    try {
      const userProfile = await UserModels.findById(userId).select("-password");
      if (!userProfile) {
        return res.status(404).json({ error: "User not found" });
      }
      return res.status(200).json(userProfile);
    } catch (error) {
      return res.status(500).json({ error: "Internal Server Error" });
    }
  }

  if (req.method === "PUT") {
    try {
      if (user.id !== userId && user.role !== "admin") {
        return res.status(403).json({ error: "Not authorized" });
      }

      const updatedUser = await UserModels.findByIdAndUpdate(userId, req.body, { new: true }).select("-password");
      return res.status(200).json(updatedUser);
    } catch (error) {
      return res.status(500).json({ error: "Internal Server Error" });
    }
  }

  return res.status(405).json({ error: "Method Not Allowed" });
};

export default requireAuth(handler);
