import { NextApiRequest, NextApiResponse } from "next";
import NotificationsModels from "@/models/Notifications.models";
import { connectDb } from "../lib/mongodb";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "PATCH") return res.status(405).json({ error: "Method not allowed" });

  await connectDb();
  const { userId } = req.body;

  await NotificationsModels.updateMany({ userId, read: false }, { read: true });

  res.status(200).json({ success: true, message: "Notifications marked as read" });
}
