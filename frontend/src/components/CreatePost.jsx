import React, { useState, useContext } from "react";
import API from "../Utils/axiosInstance";
import { AuthContext } from "../context/AuthContext";
import "../styles/Feed.css";

const CreatePost = ({ onPostCreated }) => {
  const [content, setContent] = useState("");
  const { user } = useContext(AuthContext);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!user) return alert("You must be logged in to post!");

    try {
      const res = await API.post("/posts", { content });
      onPostCreated(res.data);
      setContent("");
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="create-post-box">
      <textarea
        value={content}
        onChange={(e) => setContent(e.target.value)}
        placeholder="What's on your mind?"
      />
      <button type="submit">Post</button>
    </form>
  );
};

export default CreatePost;
