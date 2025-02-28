import { NextApiRequest, NextApiResponse } from "next";
import CollaborationsModels from "@/models/Collaborations.models";
import { connectDb } from "../lib/mongodb";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "POST") return res.status(405).json({ error: "Method not allowed" });

  await connectDb();
  const { title, content, userId } = req.body;

  const doc = await CollaborationsModels.create({ title, content, userId });

  res.status(201).json({ success: true, doc });
}
