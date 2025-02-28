import { NextApiRequest, NextApiResponse } from "next";
import NotificationsModels from "@/models/Notifications.models";
import { connectDb } from "../lib/mongodb";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "GET") return res.status(405).json({ error: "Method not allowed" });

  await connectDb();
  const notifications = await NotificationsModels.find({ userId: req.query.userId }).sort({ createdAt: -1 });

  res.status(200).json({ success: true, notifications });
}
