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

app.post("/login", async (req, res) => {
  const { username, email, password } = req.body;

  try {
    const user = await User.findOne({ $or: [{ email }, { username }] });

    if (!user)
      return res.status(409).json({ message: "Wrong username or email!" });

    const checkPassword = await bcrypt.compare(password, user.password);

    if (!checkPassword)
      return res.status(401).json({ message: "Wrong password!" });

    res.status(200).json({ user: user, message: "Logged in!" });
  } catch (error) {
    console.error(error.message);
    return res.status(500).json({ message: "Server error" });
  }
});

app.post("/createUser", async (req, res) => {
  const { username, email, password, role } = req.body;

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
      role: role,
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
    const { username, email, password, role } = req.body;

    if (!username && !email && !password && !role) {
      return res.status(400).json({ message: "No input!" });
    }

    const update = {};
    if (username) update.username = username;
    if (email) update.email = email;
    if (role) update.role = role;
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

app.delete("/deleteUser/:id", async (req, res) => {
  try {
    const user = await User.deleteOne({ _id: req.params.id });
    res.status(200).json({ message: "user deleted successfully" });
  } catch (error) {
    console.error(error.message);
    return res.status(500).json({ message: "Server error" });
  }
});
export default app;
