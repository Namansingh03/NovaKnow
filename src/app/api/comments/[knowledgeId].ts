import { NextApiRequest, NextApiResponse } from "next";
import CommentsModels from "@/models/Comments.models";
import { connectDb } from "../lib/mongodb";

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  await connectDb();

  if (req.method === "GET") {
    try {
      const { knowledgeId } = req.query;
      if (!knowledgeId) {
        return res.status(400).json({ error: "Knowledge ID is required" });
      }

      const comments = await CommentsModels.find({ knowledge: knowledgeId }).populate("author", "name email");
      return res.status(200).json(comments);
    } catch (error) {
      return res.status(500).json({ error: "Internal Server Error" });
    }
  }

  return res.status(405).json({ error: "Method Not Allowed" });
};

export default handler;
