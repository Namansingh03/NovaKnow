import mongoose from "mongoose";

const CollaborationSchema = new mongoose.Schema({
  knowledge: { type: mongoose.Schema.Types.ObjectId, ref: "Knowledge", required: true },
  contributors: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }], // List of contributors
  activeEditors: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }], // Users currently editing
  lastUpdated: { type: Date, default: Date.now },
});

export default mongoose.models.Collaboration || mongoose.model("Collaboration", CollaborationSchema);
