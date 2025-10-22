import express, { json } from "express";
import cors from "cors";
import bcrypt from "bcrypt";
import User from "./models/User.js";

const app = express();

app.use(cors());
app.use(express.json());

app.get("/users", async (req, res) => {
  const users = await User.find();
  res.json(users);
});

app.post("/createUser", async (req, res) => {
  const { username, email, password } = req.body;

  if (!username || !email || !password) {
    res.status(400).json({ message: "Fields are missing!" });
    return;
  }

  try {
    const uniqueUser = await User.findOne({ $or: [{ email }, { username }] });
    if (uniqueUser) {
      if (uniqueUser.username == username) {
        res.status(409).json({ message: "Username is already taken!" });
        return;
      } else if (uniqueUser.email == email) {
        res.status(409).json({ message: "Email is already taken!" });
        return;
      }
    }

    const passwordHash = await bcrypt.hash(password, 10);

    const user = await User.create({
      username: username,
      email: email,
      password: passwordHash,
    });
    res
      .status(201)
      .json({ message: `User: ${username} was create succesfully!` });
  } catch (error) {
    console.log(error.message);
    return res.status(500).json({ message: "Server error" });
  }
});

app.put("/editUser/:id", async (req, res) => {
  try {
    const { username, email, password } = req.body;

    if (!username && !email && !password) {
      return res.status(400).json({ message: "No input!" });
    }

    const update = {};
    if (username) update.username = username;
    if (email) update.email = email;
    if (password) {
      const passwordHash = await bcrypt.hash(password, 10);
      update.password = passwordHash;
    }

    const user = await User.findByIdAndUpdate(req.params.id, update, {
      new: true,
      runValidators: true,
    });

    if (!user)
      return res
        .status(404)
        .json({ message: "No user with that id was found!" });

    res.status(200).json({ user: user, message: "User updated!" });
  } catch (error) {
    console.error(error.message);
    return res.status(500).json({ message: "Server error" });
  }
});

const deleteUsers = async () => {
  const deleteUser = await User.deleteMany();
};
export default app;
