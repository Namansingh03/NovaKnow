import { NextApiRequest, NextApiResponse } from "next";
import { requireAuth } from "@/middleware/requireAuth";
import UserModels from "@/models/User.models";
import CommentsModels from "@/models/Comments.models";
import { connectDb } from "../lib/mongodb";

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  await connectDb();
  const { id } = req.query;
  const user = (req as any).user;

  if (!id) {
    return res.status(400).json({ error: "Comment ID is required" });
  }

  if (req.method === "PUT") {
    try {
      const { content } = req.body;
      if (!content) {
        return res.status(400).json({ error: "Content is required" });
      }

      const comment = await CommentsModels.findById(id);
      if (!comment) {
        return res.status(404).json({ error: "Comment not found" });
      }

      if (comment.author.toString() !== user.id) {
        return res.status(403).json({ error: "You can only edit your own comments" });
      }

      comment.content = content;
      await comment.save();

      return res.status(200).json(comment);
    } catch (error) {
      return res.status(500).json({ error: "Internal Server Error" });
    }
  }

  if (req.method === "DELETE") {
    try {
      const comment = await CommentsModels.findById(id);
      if (!comment) {
        return res.status(404).json({ error: "Comment not found" });
      }

      const currentUser = await UserModels.findById(user.id);
      const isAdmin = currentUser && currentUser.role === "admin";

      if (comment.author.toString() !== user.id && !isAdmin) {
        return res.status(403).json({ error: "You can only delete your own comments" });
      }

      await CommentsModels.findByIdAndDelete(id);
      return res.status(200).json({ message: "Comment deleted successfully" });
    } catch (error) {
      return res.status(500).json({ error: "Internal Server Error" });
    }
  }

  return res.status(405).json({ error: "Method Not Allowed" });
};

export default requireAuth(handler);
