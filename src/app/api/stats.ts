import { MongoClient, Db, Collection } from "mongodb";
import { connectDb } from "./lib/mongodb";

async function getStats() {
  const db = await connectDb(); 
  const knowledgeCollection: Collection = db.collection("knowledge");

  const totalKnowledge = await knowledgeCollection.countDocuments();
  const totalUsers = await db.collection("users").countDocuments();

  return {
    totalKnowledge,
    totalUsers,
  };
}

export default getStats;
