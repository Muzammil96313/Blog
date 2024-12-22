import React, { useState } from "react";
import axios from "axios";

const PostForm = () => {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false); // Added loading state

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true); // Start loading
    setMessage(""); // Reset message
    try {
      const accessToken = localStorage.getItem("accessToken");
      console.log(accessToken); // Log the token to verify it

      const response = await axios.post(
        "https://blog-backend-git-master-pracatices-projects.vercel.app//api/posts",
        { title, content },
        {
          headers: { Authorization: `Bearer ${accessToken}` },
        }
      );

      setMessage("Post created successfully!");
      setTitle("");
      setContent("");
    } catch (error) {
      if (error.response?.status === 401) {
        setMessage("Unauthorized! Please login.");
      } else {
        setMessage("Error creating post. Please try again.");
      }
    } finally {
      setLoading(false); // Stop loading
    }
  };

  return (
    <div className="dark:bg-gray-900 dark:text-white h-[100vh]">
      <div className="container">
        <div className="flex items-center justify-center flex-col gap-4 h-screen">
          <form
            className="flex flex-col lg:w-1/4 md:w-1/2 sm:w-full p-8 rounded-lg bg-white dark:bg-gray-800 shadow-lg"
            onSubmit={handleSubmit}
          >
            <h2 className="text-4xl mb-6 text-center font-bold">
              Create a New Post
            </h2>
            <label htmlFor="title" className="mb-2">
              Enter Your Title:
            </label>
            <input
              type="text"
              className="border border-gray-300 py-2 px-3 rounded-md mb-2 text-black placeholder:text-black"
              placeholder="Title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
            />
            <label htmlFor="content" className="mb-2">
              Enter Your Content:
            </label>
            <textarea
              className="border border-gray-300 py-2 px-3 rounded-md mb-4 text-black placeholder:text-black"
              placeholder="Content"
              value={content}
              onChange={(e) => setContent(e.target.value)}
              required
            ></textarea>
            <button
              className={`bg-blue-500 text-white py-2 px-4 rounded-md hover:bg-blue-600 text-xl font-bold ${
                loading ? "opacity-50" : ""
              }`}
              type="submit"
              disabled={loading} // Disable button while loading
            >
              {loading ? "Creating..." : "Create Post"}
            </button>
          </form>
          {message && (
            <p className="text-center text-red-500 mt-4">{message}</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default PostForm;
