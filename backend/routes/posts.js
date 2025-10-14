const express = require("express");
const router = express.Router();
const Post = require("../models/Post");
const User = require("../models/Users");
const { protect } = require("../middleware/authMiddleware");
const mongoose = require("mongoose");

// 🟢 CREATE POST
router.post("/", protect, async (req, res) => {
  try {
    const newPost = new Post({
      user: req.user._id,
      content: req.body.content,
    });

    const savedPost = await newPost.save();
    res.status(201).json(savedPost);
  } catch (err) {
    console.error("Create Post Error:", err);
    res.status(500).json({ msg: "Error creating post" });
  }
});

// 🟢 GET ALL POSTS
router.get("/", protect, async (req, res) => {
  try {
    const posts = await Post.find()
      .populate("user", "name email")
      .sort({ createdAt: -1 });
    console.log(posts);
    res.json(posts);
  } catch (err) {
    console.error("Fetch Posts Error:", err);
    res.status(500).json({ msg: "Error fetching posts" });
  }
});

// 🟢 LIKE/UNLIKE POST
router.put("/:id/like", protect, async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    if (!post) return res.status(404).json({ msg: "Post not found" });

    const userId = req.user._id.toString();
    const hasLiked = post.likes.some((id) => id && id.toString() === userId);

    if (hasLiked) {
      post.likes = post.likes.filter((id) => id && id.toString() !== userId);
    } else {
      post.likes.push(new mongoose.Types.ObjectId(userId));
    }

    // Remove any accidental nulls
    post.likes = post.likes.filter(Boolean);
    await post.save();

    const updated = await Post.findById(post._id)
      .populate("user", "username email")
      .exec();

    res.json(updated);
  } catch (err) {
    console.error("LIKE ERROR:", err);
    res.status(500).json({ msg: "Error liking post", error: err.message });
  }
});

// 🟢 ADD COMMENT
router.post("/:id/comment", protect, async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    if (!post) return res.status(404).json({ msg: "Post not found" });

    post.comments.push({
      user: req.user._id,
      text: req.body.text,
    });

    await post.save();

    const updatedPost = await Post.findById(req.params.id)
      .populate("user", "username email")
      .exec();

    res.json(updatedPost);
  } catch (err) {
    console.error("Comment Error:", err);
    res.status(500).json({ msg: "Error adding comment" });
  }
});

module.exports = router;
