import { NextApiRequest, NextApiResponse } from "next";
import { requireAuth } from "@/middleware/requireAuth";
import { connectDb } from "../lib/mongodb";
import UserModels from "@/models/User.models";

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  await connectDb();

  if (req.method !== "GET") {
    return res.status(405).json({ error: "Method Not Allowed" });
  }

  const user = await UserModels.findById((req as any).user.id).select("-password");
  if (!user) {
    return res.status(404).json({ error: "User not found" });
  }

  return res.status(200).json(user);
};

export default requireAuth(handler);
