import { useState } from "react";
import API from "../Utils/axiosInstance";

const PostCard = ({ post, onLike }) => {
  const [commentText, setCommentText] = useState("");
  const [comments, setComments] = useState(post.comments || []);

  const handleLike = async () => {
    try {
      const res = await API.put(`/posts/${post._id}/like`);
      onLike(res.data);
    } catch (err) {
      console.error("Like failed:", err);
    }
  };

  const handleComment = async () => {
    if (!commentText.trim()) return;
    try {
      const res = await API.post(`/posts/${post._id}/comment`, {
        text: commentText,
      });
      setComments(res.data.comments);
      setCommentText("");
    } catch (err) {
      console.error("Comment failed:", err);
    }
  };

  return (
    <div className="post-card">
      <h4>{post.user?.name || post.user?.email || "Unknown User"}</h4>
      <p>{post.content}</p>
      <div className="post-actions">
        <button onClick={handleLike} className="like-btn">
          ❤️ {post.likes?.length || 0}
        </button>
      </div>

      {/* Comment Section */}
      <div className="comment-section">
        <input
          type="text"
          value={commentText}
          onChange={(e) => setCommentText(e.target.value)}
          placeholder="Add a comment..."
        />
        <button onClick={handleComment}>Comment</button>

        <div className="comments-list">
          {comments.map((c, idx) => (
            <p key={idx}>
              <strong>{c.user?.name || "User"}:</strong> {c.text}
            </p>
          ))}
        </div>
      </div>
    </div>
  );
};

export default PostCard;
