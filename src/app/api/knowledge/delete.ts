import { NextApiRequest, NextApiResponse } from "next";
import KnowledgeModels from "@/models/Knowledge.models";
import { connectDb } from "../lib/mongodb";
import { requireAuth } from "@/middleware/requireAuth";

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  if (req.method !== "DELETE") return res.status(405).json({ error: "Method Not Allowed" });

  await connectDb();

  try {
    const { id } = req.query;

    const entry = await KnowledgeModels.findById(id);

    if (!entry) return res.status(404).json({ error: "Knowledge not found" });

    if (entry.author.toString() !== (req as any).user.id)
      return res.status(403).json({ error: "Unauthorized" });

    await entry.deleteOne();

    return res.status(200).json({ message: "Deleted successfully" });
  } catch (error) {
    return res.status(500).json({ error: "Internal Server Error" });
  }
};

export default requireAuth(handler);
