// CommentForm.jsx
import React, { useState } from "react";
import { db } from "../../firebase";
import { collection, addDoc, Timestamp } from "firebase/firestore";

const CommentForm = ({ postId, fetchComments }) => {
  const [content, setContent] = useState("");
  const [isCommentButtonDisabled, setIsCommentButtonDisabled] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!content.trim()) return;

    setIsCommentButtonDisabled(true);
    try {
      await addDoc(collection(db, "comments"), {
        postId,
        content,
        createdAt: Timestamp.now(),
        userId: "currentUserId", // Replace this with actual user data
        userName: "currentUserName", // Replace with logged-in user's name
        likes: [],
      });
      setContent("");
      fetchComments(); // Custom fetch function from parent
    } catch (error) {
      console.error("Error adding comment to Firebase:", error);
    } finally {
      setIsCommentButtonDisabled(false);
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
