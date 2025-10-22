import dotenv from "dotenv";
import mongoose from "mongoose";
import app from "./server.js";

dotenv.config();

const PORT = process.env.PORT || 3000;

mongoose
  .connect("mongodb://127.0.0.1:27017/filip")
  .then(() => {
    console.log("MongoDB connected");
    app.listen(PORT, "0.0.0.0", () =>
      console.log(`Server is up and running really fast on port ${PORT}!`)
    );
  })
  .catch((err) => console.error("Connection error:", err));
