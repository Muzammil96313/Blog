import React, { useState } from "react";
import { doc, updateDoc } from "firebase/firestore";
import { db } from "../../firebase"; // Correct firebase path

const EditPostForm = ({ post, onCancel, onUpdate, postId }) => {
  const [title, setTitle] = useState(post.title);
  const [content, setContent] = useState(post.content);

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const postRef = doc(db, "posts", postId);
      await updateDoc(postRef, {
        title,
        content,
        updatedAt: new Date(),
      });

      console.log("Post updated in Firebase");
      onUpdate(); // refresh posts
      onCancel(); // close the form
    } catch (error) {
      console.error("Firebase update error:", error);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="mt-4">
      <input
        type="text"
        className="w-full p-2 border rounded mb-2 text-black"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        placeholder="Post Title"
        required
      />
      <textarea
        className="w-full p-2 border rounded text-black"
        value={content}
        onChange={(e) => setContent(e.target.value)}
        placeholder="Post Content"
        required
      />
      <div className="flex justify-end mt-2">
        <button
          type="button"
          onClick={onCancel}
          className="bg-gray-500 hover:bg-gray-700 text-white font-bold py-1 px-4 rounded mr-2"
        >
          Cancel
        </button>
        <button
          type="submit"
          className="bg-green-500 hover:bg-green-700 text-white font-bold py-1 px-4 rounded"
        >
          Save
        </button>
      </div>
    </form>
  );
};

export default EditPostForm;
