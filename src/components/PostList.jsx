import React, { useEffect, useState } from "react";
import axios from "axios";
import { NavLink } from "react-router-dom";
import PostComments from "./PostComments";
import EditPostForm from "./EditPostForm";
import { FaTrashCan } from "react-icons/fa6";
import { FaRegEdit } from "react-icons/fa";
import { AiOutlineDislike, AiOutlineLike } from "react-icons/ai";

const PostList = () => {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(false); // State for handling loading indicator
  const [editingPostId, setEditingPostId] = useState(null); // Track which post is being edited
  const [deletePostId, setDeletePostId] = useState(null); // For modal visibility
  const [showModal, setShowModal] = useState(false); // Show/hide modal
  const [isLikeButtonDisabled, setIsLikeButtonDisabled] = useState(null); // Disable button after click

  let currentUserId = null; // Declare variable globally
  const token = localStorage.getItem("accessToken");
  if (token) {
    const decodedToken = JSON.parse(atob(token.split(".")[1])); // Decode the JWT payload
    currentUserId = decodedToken.id; // Set the current user ID
  }
  // Function to fetch posts from the backend
  const fetchPosts = async () => {
    try {
      const response = await axios.get(
        "https://blog-backend-git-master-pracatices-projects.vercel.app/api/posts"
      ); // Replace with your backend URL
      setPosts(response.data);
    } catch (error) {
      console.error("Error fetching posts:", error);
    }
  };
  // const fetchUserDetails = async () => {
  //   try {
  //     const token = localStorage.getItem("accessToken");
  //     const response = await axios.get(
  //       "https://blog-backend-git-master-pracatices-projects.vercel.app/api/auth/profile",
  //       {
  //         headers: { Authorization: `Bearer ${token}` },
  //       }
  //     );
  //     setUser(response.data); // Save user data including avatar
  //   } catch (error) {
  //     console.error("Error fetching user details:", error);
  //   }
  // };

  // Run fetchPosts on component mount
  useEffect(() => {
    // fetchUserDetails();
    fetchPosts();
  }, []);

  // Function to delete a post
  const handleDelete = async () => {
    if (!deletePostId) {
      console.error("Error: No post ID provided for deletion.");
      return;
    }

    try {
      const token = localStorage.getItem("accessToken"); // Retrieve token
      setLoading(true); // Set loading state
      console.log("Deleting post with ID:", deletePostId); // Debugging
      await axios.delete(
        `https://blog-backend-git-master-pracatices-projects.vercel.app/api/posts/${deletePostId}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      fetchPosts(); // Refresh the post list
      setShowModal(false); // Close the modal
    } catch (error) {
      console.error("Error deleting post:", error);
    } finally {
      setLoading(false); // Reset loading state
      setDeletePostId(null); // Reset the post ID
    }
  };

  // Function to like or unlike a post
  const handleLike = async (postId) => {
    if (isLikeButtonDisabled) return; // Prevent multiple clicks
    setIsLikeButtonDisabled(true); // Disable button

    try {
      const token = localStorage.getItem("accessToken");
      if (!token) throw new Error("Authentication token is missing");

      await axios.put(
        `https://blog-backend-git-master-pracatices-projects.vercel.app/api/posts/${postId}/like`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );
      fetchPosts();
    } catch (error) {
      console.error("Error liking post:", error);
    } finally {
      setIsLikeButtonDisabled(false); // Re-enable button after the action
    }
  };

  return (
    <div className="dark:bg-gray-900 dark:text-white min-h-[100vh] max-h-full pb-10">
      <div className="container">
        {/* Header section with title and create post button */}
        <div className="flex items-center justify-between mb-4 py-10">
          <h2 className="text-4xl font-bold">All Posts</h2>
          <NavLink
            className="bg-blue-500 hover:bg-blue-700 font-bold py-2 px-4 rounded"
            to="/create"
          >
            Create Post
          </NavLink>
        </div>

        {/* Loading indicator */}
        {loading && <p className="text-center text-blue-500">Processing...</p>}

        {/* List of posts */}
        <ul className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {posts.map((post, index) => {
            const isLikedByCurrentUser = post.likes.includes(currentUserId);
            return (
              <li
                className="py-8 px-4 shadow-lg rounded-lg bg-white text-black dark:bg-gray-700 dark:text-white h-auto"
                key={post._id}
              >
                {editingPostId === post._id ? (
                  // Show Edit Form if the post is being edited
                  <EditPostForm
                    postId={post._id}
                    post={post}
                    onCancel={() => setEditingPostId(null)}
                    onUpdate={fetchPosts}
                  />
                ) : (
                  <>
                    <span className="text-xl font-bold text-gray-500">
                      No. {index + 1}
                    </span>
                    {/* Post title and content */}
                    <h3 className="text-3xl font-semibold mb-2">
                      {post.title}
                    </h3>
                    <ExpandableContent content={post.content} />

                    {/* Buttons for delete, like, edit, and showing likes count */}
                    <div className="flex justify-between items-center mt-4">
                      <button
                        onClick={() => handleLike(post._id)}
                        className={`${
                          isLikedByCurrentUser
                            ? "bg-red-500 hover:bg-red-700"
                            : "bg-green-500 hover:bg-green-700"
                        } text-white font-bold py-1 px-3 rounded`}
                        disabled={isLikeButtonDisabled} // Disable button during action
                      >
                        {isLikedByCurrentUser ? (
                          <AiOutlineDislike className="text-2xl" />
                        ) : (
                          <AiOutlineLike className="text-2xl" />
                        )}
                      </button>
                      {post.user._id === currentUserId && (
                        <>
                          {" "}
                          <div className="flex items-center gap-6">
                            <button
                              onClick={() => {
                                setDeletePostId(post._id);
                                setShowModal(true); // Show modal on delete click
                              }}
                              className="bg-red-500 hover:bg-red-700 text-white font-bold py-1 px-3 rounded"
                            >
                              <FaTrashCan className="text-2xl" />
                            </button>
                            <button
                              onClick={() => setEditingPostId(post._id)}
                              className="bg-yellow-500 hover:bg-yellow-700 text-white font-bold py-1 px-3 rounded"
                            >
                              <FaRegEdit className="text-2xl" />
                            </button>
                          </div>
                        </>
                      )}
                    </div>
                    <p className="text-gray-500 mt-2">
                      Likes: {post.likes?.length || 0}
                    </p>

                    {/* Post author */}
                    {/* Post author with avatar */}
                    <div className="flex items-center mt-2">
                      {post.user.avatar ? (
                        <img
                          src={post.user.avatar} // Use the full URL path for avatar
                          alt={`${post.user.name}'s Avatar`}
                          className="w-8 h-8 rounded-full mr-2"
                        />
                      ) : (
                        <div className="w-8 h-8 bg-gray-300 rounded-full mr-2"></div>
                      )}
                      <small className="text-gray-500">
                        By: {post.user.name || "Unknown"}
                      </small>
                    </div>

                    {/* Post comments */}
                    <div className="mt-4">
                      <PostComments
                        postId={post._id}
                        postUserId={post.user._id}
                        currentUserId={currentUserId}
                      />
                    </div>
                  </>
                )}
              </li>
            );
          })}
        </ul>
        {showModal && (
          <div
            className="fixed inset-0 flex items-center justify-center bg-white dark:bg-transparent bg-opacity-50 backdrop-blur-sm"
            style={{ zIndex: 9999 }}
          >
            <div className="bg-white p-6 rounded-lg shadow-lg w-96">
              <h2 className="text-xl font-semibold mb-4 text-black">
                Are you sure you want to delete this post?
              </h2>
              <div className="flex justify-end space-x-4">
                <button
                  onClick={() => setShowModal(false)} // Cancel action
                  className="bg-gray-500 hover:bg-gray-700 text-white font-bold py-1 px-3 rounded"
                >
                  No
                </button>
                <button
                  onClick={handleDelete} // Confirm delete
                  className="bg-red-500 hover:bg-red-700 text-white font-bold py-1 px-3 rounded"
                >
                  Yes
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Message for empty post list */}
        {posts.length === 0 && (
          <p className="text-center text-gray-500 mt-4">No posts available.</p>
        )}
      </div>
    </div>
  );
};

const ExpandableContent = ({ content }) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const maxWords = 12; // Maximum number of words to display initially

  const toggleContent = () => {
    setIsExpanded(!isExpanded);
  };

  const displayedContent = isExpanded
    ? content
    : content.split(" ").slice(0, maxWords).join(" ") +
      (content.split(" ").length > maxWords ? "..." : "");

  return (
    <div>
      <p className="text-lg dark:text-gray-300 text-gray-500 mb-2">
        {displayedContent}
      </p>
      {content.split(" ").length > maxWords && (
        <button
          onClick={toggleContent}
          className="text-blue-500 font-medium hover:underline"
        >
          {isExpanded ? "Show Less" : "Show More"}
        </button>
      )}
    </div>
  );
};
export default PostList;
