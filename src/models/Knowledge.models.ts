import mongoose from "mongoose";

const KnowledgeSchema = new mongoose.Schema({
  title: { 
    type: String, 
    required: true 
  },
  content: { 
    type: String, 
    required: true 
  },
  author: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: "User", 
    required: true 
  },
  tags: [{ 
    type: String }],
  views: { 
    type: Number, 
    default: 0 
  },
  upvotes: { 
    type: Number, default: 0 },
  createdAt: { 
    type: Date, 
    default: Date.now 
  },
  updatedAt: { 
    type: Date, 
    default: Date.now 
  },
});

export default mongoose.models.Knowledge || mongoose.model("Knowledge", KnowledgeSchema);
