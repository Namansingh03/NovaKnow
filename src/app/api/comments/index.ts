import { NextApiRequest, NextApiResponse } from "next";
import { requireAuth } from "@/middleware/requireAuth";
import CommentsModels from "@/models/Comments.models";
import { connectDb } from "../lib/mongodb";

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  await connectDb();

  if (req.method === "POST") {
    try {
      const { content, knowledge } = req.body;
      if (!content || !knowledge) {
        return res.status(400).json({ error: "Missing content or knowledge ID" });
      }

      const newComment = await CommentsModels.create({
        content,
        knowledge,
        author: (req as any).user.id,
      });

      return res.status(201).json(newComment);
    } catch (error) {
      return res.status(500).json({ error: "Internal Server Error" });
    }
  }

  if (req.method === "GET") {
    try {
      const comments = await CommentsModels.find().populate("author", "name email");
      return res.status(200).json(comments);
    } catch (error) {
      return res.status(500).json({ error: "Internal Server Error" });
    }
  }

  return res.status(405).json({ error: "Method Not Allowed" });
};

export default requireAuth(handler);
