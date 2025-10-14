import { useState, useEffect, useContext, useRef } from "react";
import API from "../Utils/axiosInstance";
import CreatePost from "../components/CreatePost";
import PostCard from "../components/PostCard";
import { AuthContext } from "../context/AuthContext";
import "../styles/Feed.css";

const Feed = () => {
  const { user, loading } = useContext(AuthContext);
  const [posts, setPosts] = useState([]);
  const feedContainerRef = useRef(null);

  useEffect(() => {
    if (user) fetchPosts();
  }, [user]);

  const fetchPosts = async () => {
    try {
      const res = await API.get("/posts");
      setPosts(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  const handlePostCreated = (newPost) => {
    setPosts((prev) => [newPost, ...prev]);
    // 🔹 Scroll container to top without hiding post box
    if (feedContainerRef.current) {
      feedContainerRef.current.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  const handleLikeUpdate = (updatedPost) =>
    setPosts((prev) =>
      prev.map((p) => (p._id === updatedPost._id ? updatedPost : p))
    );

  if (loading) return <p>Loading...</p>;
  if (!user) return <p>Please log in to see your feed.</p>;

  return (
    <div className="feed-page">
      <div className="create-post-box">
        <CreatePost onPostCreated={handlePostCreated} />
      </div>

      <div className="feed-container" ref={feedContainerRef}>
        {posts.map((p) => (
          <PostCard key={p._id} post={p} onLike={handleLikeUpdate} />
        ))}
      </div>
    </div>
  );
};

export default Feed;
