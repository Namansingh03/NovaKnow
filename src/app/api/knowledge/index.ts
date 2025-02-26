import { NextApiRequest, NextApiResponse } from "next";
import { connectDb } from "../lib/mongodb";
import KnowledgeModels from "@/models/Knowledge.models";

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  if (req.method !== "GET") return res.status(405).json({ error: "Method Not Allowed" });

  await connectDb();

  try {
    const knowledgeList = await KnowledgeModels.find().populate("author", "name email");
    return res.status(200).json(knowledgeList);
  } catch (error) {
    return res.status(500).json({ error: "Internal Server Error" });
  }
};

export default handler;
