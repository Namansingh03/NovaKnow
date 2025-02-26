import mongoose from "mongoose";

const ReputationSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  upvotesReceived: { type: Number, default: 0 },
  contributions: { type: Number, default: 0 },
  reputationScore: { type: Number, default: 0 }, 
});

export default mongoose.models.Reputation || mongoose.model("Reputation", ReputationSchema);
