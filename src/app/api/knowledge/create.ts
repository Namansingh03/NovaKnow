import { NextApiRequest, NextApiResponse } from "next";
import { connectDb } from "../lib/mongodb";
import KnowledgeModels from "@/models/Knowledge.models";
import { requireAuth } from "@/middleware/requireAuth";

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  if (req.method !== "POST") return res.status(405).json({ error: "Method Not Allowed" });

  await connectDb();

  try {
    const { title, content, tags } = req.body;
    const newEntry = await KnowledgeModels.create({
      title,
      content,
      tags,
      author: (req as any).user.id,
    });

    return res.status(201).json(newEntry);
  } catch (error) {
    return res.status(500).json({ error: "Internal Server Error" });
  }
};

export default requireAuth(handler);
