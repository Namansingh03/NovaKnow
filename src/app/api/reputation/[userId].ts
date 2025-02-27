import { NextApiRequest, NextApiResponse } from "next";
import ReputationModels from "@/models/Reputation.models";
import { connectDb } from "../lib/mongodb";

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  await connectDb();
  const { userId } = req.query;

  if (!userId) {
    return res.status(400).json({ error: "User ID is required" });
  }

  if (req.method === "GET") {
    try {
      const reputation = await ReputationModels.findOne({ user: userId });
      return res.status(200).json(reputation || { upvotesReceived: 0, contributions: 0 });
    } catch (error) {
      return res.status(500).json({ error: "Internal Server Error" });
    }
  }

  return res.status(405).json({ error: "Method Not Allowed" });
};

export default handler;
