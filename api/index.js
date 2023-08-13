const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const mongoose = require("mongoose");
const User = require("./models/User");
const Post = require("./models/Post");
const bcrypt = require("bcryptjs");
const app = express();
const jwt = require("jsonwebtoken");
const cookieParser = require("cookie-parser");
const multer = require("multer");
const uploadMiddleware = multer({ dest: "uploads/" });
const fs = require("fs");
 
dotenv.config();
const salt = bcrypt.genSaltSync(10);
const secret = process.env.SECRET_KEY;
var request = require("request");

app.use(
  cors({
    credentials: true,
    origin: (origin, callback) => {
      // Allow requests from any origin with credentials
      callback(null, true);
    },
  })
);
app.use(express.json());
app.use(cookieParser());
app.use("/uploads", express.static(__dirname + "/uploads"));

mongoose.set("strictQuery", false);
mongoose.connect(process.env.MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

app.post("/register", async (req, res) => {
  const { username, password } = req.body;
  const following = [];
  const followers = [];

  try {
    const existingUser = await User.findOne({ username });
    if (existingUser) {
      return res
        .status(400)
        .json({ message: "User already exists with the same username" });
    }

    const userDoc = await User.create({
      username,
      password: bcrypt.hashSync(password, salt),
      followers,
      following,
    });

    res.status(201).json(userDoc);
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({ message: "An error occurred while processing your request" });
  }
});

app.post("/login", async (req, res) => {
  const { username, password } = req.body;
  const userDoc = await User.findOne({ username });

  if (!userDoc) {
    // User doesn't exist
    return res
      .status(404)
      .json({ message: "User doesn't exist. Please sign up." });
  }

  const passOk = bcrypt.compareSync(password, userDoc.password);

  if (passOk) {
    jwt.sign({ username, id: userDoc._id }, secret, {}, (err, token) => {
      if (err) {
        console.error("Error generating token:", err);
        return res.status(500).json({ message: "Internal server error" });
      }

      res.json({
        id: userDoc._id,
        username,
        following: userDoc.following,
        token,
      });
    });
  } else {
    res.status(400).json({ message: "Wrong credentials. Please try again." });
  }
});

app.get("/profile", (req, res) => {
  const token = req.headers["authorization"];
  if (!token || !token.startsWith("Bearer ")) {
    return res.status(401).json({ message: "Unauthorized" });
  }
  const authToken = token.substring(7);

  try {
    jwt.verify(authToken, secret, {}, (err, info) => {
      if (err) {
        console.log("JWT verification failed:", err);
        return res.status(401).json({ message: "Unauthorized" });
      }
      res.json(info);
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Internal server error" });
  }
});

app.post("/logout", (req, res) => {
  res.json("ok");
});

app.post("/post", uploadMiddleware.single("file"), async (req, res) => {
  const authToken = req.headers["authorization"];
  const token = authToken.substring(7);
  jwt.verify(token, secret, {}, async (err, info) => {
    if (err) {
      console.error("JWT Verification Error:", err);
      return res.status(401).json({ message: "Unauthorized" });
    }

    const { title, summary, content } = req.body;
    const formattedText = content.replace(/\n/g, "\\n");
    let category = "Others";
    const likes = {};
    const views = 0;

    try {
      const data = await new Promise((resolve, reject) => {
        const options = {
          method: "POST",
          url: "http://api.textrazor.com",
          headers: {
            "x-textrazor-key": process.env.TEXTRAZOR_API_KEY,
            "Content-Type": "application/x-www-form-urlencoded",
          },
          form: {
            text: formattedText,
            extractors: "topics",
          },
        };
        request(options, function (error, response) {
          if (error) reject(error);
          resolve(JSON.parse(response.body));
        });
      });
      if (data.response.coarseTopics)
        category = data.response.coarseTopics[0].label;
      else if (data.response.topics) category = data.response.topics[0].label;
      else category = "Others";
    } catch (error) {
      console.error("Error:", error);
    }

    const { originalname, path } = req.file;
    const parts = originalname.split(".");
    const ext = parts[parts.length - 1];
    const newPath = path + "." + ext;
    fs.renameSync(path, newPath);

    const postDoc = await Post.create({
      title,
      summary,
      content,
      cover: newPath,
      category,
      author: info.id,
      likes,
      views,
    });

    res.json(postDoc);
  });
});

app.put("/post", uploadMiddleware.single("file"), async (req, res) => {
  // Get the token from the request headers
  const authToken = req.headers["authorization"];
  const token = authToken.substring(7);
  jwt.verify(token, secret, {}, async (err, info) => {
    if (err) throw err;
    const { id, title, summary, content } = req.body;
    const postDoc = await Post.findById(id);
    const isAuthor = JSON.stringify(postDoc.author) === JSON.stringify(info.id);
    if (!isAuthor) {
      return res.status(400).json("you are not the author");
    }

    let newPath = null;
    if (req.file) {
      const { originalname, path } = req.file;
      const parts = originalname.split(".");
      const ext = parts[parts.length - 1];
      newPath = path + "." + ext;
      fs.renameSync(path, newPath);
    }

    await postDoc.update({
      title,
      summary,
      content,
      cover: newPath ? newPath : postDoc.cover,
    });

    res.json(postDoc);
  });
});

app.get("/post", async (req, res) => {
  res.json(
    await Post.find()
      .populate("author", ["username"])
      .sort({ createdAt: -1 })
      .limit(20)
  );
});

app.get("/post/:id", async (req, res) => {
  const { id } = req.params;
  const postDoc = await Post.findById(id).populate("author", ["username"]);
  res.json(postDoc);
});

app.patch("/post/:id/like", async (req, res) => {
  try {
    const { id } = req.params;
    const { userId } = req.body;
    const post = await Post.findById(id);
    const isLiked = post.likes.get(userId);

    if (isLiked) {
      post.likes.delete(userId);
    } else {
      post.likes.set(userId, true);
    }
    const updatedPost = await Post.findByIdAndUpdate(
      id,
      { likes: post.likes },
      { new: true }
    );

    res.status(200).json(updatedPost);
  } catch (err) {
    res.status(404).json({ message: err.message });
  }
});

app.patch("/post/:id/viewcount", async (req, res) => {
  try {
    const { id } = req.params;
    const post = await Post.findById(id);

    const updatedPost = await Post.findByIdAndUpdate(
      id,
      { views: post.views + 1 },
      { new: true }
    );
    res.status(200).json(updatedPost);
  } catch (err) {
    res.status(404).json({ message: err.message });
  }
});

app.patch("/user/:id/:followerId", async (req, res) => {
  try {
    const { id, followerId } = req.params;
    const user = await User.findById(id);
    const follower = await User.findById(followerId);

    if (user.following.includes(followerId)) {
      user.following = user.following.filter((userId) => userId !== followerId);
      follower.followers = follower.followers.filter((userId) => userId !== id);
    } else {
      user.following.push(followerId);
      follower.followers.push(id);
    }
    await user.save();
    await follower.save();

    const followers = await Promise.all(
      user.following.map((userId) => User.findById(userId))
    );
    const formattedfollowers = followers.map((u) => {
      return u._id;
    });
    res.status(200).json(formattedfollowers);
  } catch (err) {
    res.status(404).json({ message: err.message });
  }
});

app.get("/user/:id/following", async (req, res) => {
  const id = req.params.id;
  try {
    const user = await User.findById(id);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    res.json(user.following);
  } catch (err) {
    res.status(500).json({ message: "Internal server error" });
  }
});

app.get("/user/:id", async (req, res) => {
  const { id } = req.params;
  try {
    const user = await User.findById(id);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    res.json(user);
  } catch (err) {
    res.status(500).json({ message: "Internal server error" });
  }
});

app.get("/:id/following", async (req, res) => {
  try {
    const { id } = req.params;
    const user = await User.findById(id);

    const following = await Promise.all(
      user.following.map((id) => User.findById(id))
    );

    const formattedfollowing = following.map(({ _id, username }) => {
      return { _id, username };
    });
    res.status(200).json(formattedfollowing);
  } catch (err) {
    res.status(404).json({ message: err.message });
  }
});
app.listen(4000);
