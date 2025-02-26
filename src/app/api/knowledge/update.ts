import { NextApiRequest, NextApiResponse } from "next";
import { connectDb } from "../lib/mongodb";
import { requireAuth } from "@/middleware/requireAuth";
import KnowledgeModels from "@/models/Knowledge.models";

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  if (req.method !== "PUT") return res.status(405).json({ error: "Method Not Allowed" });

  await connectDb();

  try {
    const { id } = req.query;
    const { title, content, tags } = req.body;

    const entry = await KnowledgeModels.findById(id);

    if (!entry) return res.status(404).json({ error: "Knowledge not found" });

    if (entry.author.toString() !== (req as any).user.id)
      return res.status(403).json({ error: "Unauthorized" });

    entry.title = title;
    entry.content = content;
    entry.tags = tags;
    entry.updatedAt = new Date();

    await entry.save();

    return res.status(200).json(entry);
  } catch (error) {
    return res.status(500).json({ error: "Internal Server Error" });
  }
};

export default requireAuth(handler);
