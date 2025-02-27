import { NextApiRequest, NextApiResponse } from "next";
import ReputationModels from "@/models/Reputation.models";
import { connectDb } from "../lib/mongodb";

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  await connectDb();

  if (req.method === "GET") {
    try {
      const allReputation = await ReputationModels.find().populate("user", "name email");
      return res.status(200).json(allReputation);
    } catch (error) {
      return res.status(500).json({ error: "Internal Server Error" });
    }
  }

  return res.status(405).json({ error: "Method Not Allowed" });
};

export default handler;
