import React, { useState } from "react";
import axios from "axios";

const EditPostForm = ({ post, onCancel, onUpdate, postId }) => {
  const [title, setTitle] = useState(post.title);
  const [content, setContent] = useState(post.content);

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const token = localStorage.getItem("accessToken"); // Retrieve the token
      const response = await axios.put(
        `http://localhost:5000/api/posts/${postId}`, // Use the correct post ID
        { title, content },
        { headers: { Authorization: `Bearer ${token}` } } // Include auth token
      );

      console.log("Post updated:", response.data);
      onUpdate(); // Refresh the post list
      onCancel(); // Close the edit form
    } catch (error) {
      console.error("Error updating post:", error);
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
