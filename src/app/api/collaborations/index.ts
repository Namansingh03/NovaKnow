import { NextApiRequest, NextApiResponse } from "next";
import CollaborationsModels from "@/models/Collaborations.models";
import { connectDb } from "../lib/mongodb";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "GET") return res.status(405).json({ error: "Method not allowed" });

  await connectDb();
  const docs = await CollaborationsModels.find().sort({ updatedAt: -1 });

  res.status(200).json({ success: true, docs });
}
