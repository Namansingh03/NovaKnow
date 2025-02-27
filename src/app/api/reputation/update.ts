import { NextApiRequest, NextApiResponse } from "next";
import { requireAuth } from "@/middleware/requireAuth";
import ReputationModels from "@/models/Reputation.models";
import { connectDb } from "../lib/mongodb";

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  await connectDb();
  const { userId, type } = req.body;

  if (!userId || !type) {
    return res.status(400).json({ error: "User ID and type are required" });
  }

  if (req.method === "POST") {
    try {
      let reputation = await ReputationModels.findOne({ user: userId });

      if (!reputation) {
        reputation = new ReputationModels({ user: userId, upvotesReceived: 0, contributions: 0 });
      }

      if (type === "upvote") {
        reputation.upvotesReceived += 1;
      } else if (type === "contribution") {
        reputation.contributions += 1;
      }

      await reputation.save();
      return res.status(200).json(reputation);
    } catch (error) {
      return res.status(500).json({ error: "Internal Server Error" });
    }
  }

  return res.status(405).json({ error: "Method Not Allowed" });
};

export default requireAuth(handler);
