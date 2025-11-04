import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true },
  email: { type: String, required: true, unique: true },
  role: { tyoe: String, required: true, default: "user" },
  password: { type: String, required: true },
  createdAt: { type: Date, default: Date.now },
  upDatedAt: { type: Date, default: Date.now },
});

export default mongoose.model("User", userSchema);
