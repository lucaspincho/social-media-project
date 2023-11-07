import express from "express";
import { getFeedPosts, getUserPosts, likePost } from "../controllers/posts.js";
import { verifyToken } from "../middleware/auth.js";

const router = express.Router();

/* READ */
router.get("/", verifyToken, getFeedPosts);
router.get("/:userId/posts", verifyToken, getUserPosts);

/* UPDATE */
router.patch("/:id/like", verifyToken, likePost);

/* Add a new route to fetch comments for a specific post */
router.get("/:postId/comments", verifyToken, async (req, res) => {
    try {
      const postId = req.params.postId;
      const post = await Post.findById(postId);
      if (!post) {
        return res.status(404).json({ message: "Post não encontrado" });
      }
      res.status(200).json({ comments: post.comments });
    } catch (error) {
      res.status(500).json({ message: "Erro ao buscar comentários" });
    }
  });
/* Add a new route to create a comment for a specific post */
router.post("/:postId/comments", verifyToken, async (req, res) => {
    try {
      const postId = req.params.postId;
      const { text } = req.body;
      const post = await Post.findById(postId);
      if (!post) {
        return res.status(404).json({ message: "Post não encontrado" });
      }
      post.comments.push({ userId: req.userId, text });
      const updatedPost = await post.save();
      res.status(201).json(updatedPost);
    } catch (error) {
      res.status(500).json({ message: "Erro ao criar comentário" });
    }
  });
    
export default router;
