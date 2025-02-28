import { NextApiRequest, NextApiResponse } from "next";
import CollaborationsModels from "@/models/Collaborations.models";
import { publisher } from "../lib/redis";
import { connectDb } from "../lib/mongodb";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "PATCH") return res.status(405).json({ error: "Method not allowed" });

  await connectDb();
  const { docId, content } = req.body;

  const doc = await CollaborationsModels.findByIdAndUpdate(docId, { content }, { new: true });

  // Publish update to Redis for real-time sync
  await publisher.publish("collaboration", JSON.stringify(doc));

  res.status(200).json({ success: true, doc });
}
