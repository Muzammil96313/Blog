import React, { useState } from "react";
import axios from "axios";

const CommentForm = ({ postId, fetchComments }) => {
  const [content, setContent] = useState("");
  const [isCommentButtonDisabled, setIsCommentButtonDisabled] = useState(null); // Disa

  const handleSubmit = async (e) => {
    if (isCommentButtonDisabled) return; // Prevent multiple clicks
    setIsCommentButtonDisabled(true); // Disable button
    e.preventDefault();
    try {
      const token = localStorage.getItem("accessToken"); // Retrieve token
      await axios.post(
        `https://blog-backend-git-master-pracatices-projects.vercel.app/api/comments/${postId}`,
        { content },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setContent("");
      fetchComments(); // Refresh comments after adding
    } catch (error) {
      console.error("Error adding comment:", error);
    } finally {
      setIsCommentButtonDisabled(false); // Re-enable button
    }
  };

  return (
    <form onSubmit={handleSubmit} className="mt-4">
      <textarea
        className="w-full p-2 border rounded text-black"
        placeholder="Add a comment..."
        value={content}
        onChange={(e) => setContent(e.target.value)}
        required
      />
      <button
        type="submit"
        className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded mt-2"
        disabled={isCommentButtonDisabled}
      >
        {isCommentButtonDisabled ? "Adding..." : "Add Comment"}
      </button>
    </form>
  );
};

export default CommentForm;
