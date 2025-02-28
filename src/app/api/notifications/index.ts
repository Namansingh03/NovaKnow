import { NextApiRequest, NextApiResponse } from "next";
import NotificationsModels from "@/models/Notifications.models";
import { connectDb } from "../lib/mongodb";
import { publisher } from "../lib/redis";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "POST") return res.status(405).json({ error: "Method not allowed" });

  await connectDb();
  const { userId, message } = req.body;

  const notification = await NotificationsModels.create({ userId, message });

  await publisher.publish("notifications", JSON.stringify(notification));

  res.status(201).json({ success: true, notification });
}
