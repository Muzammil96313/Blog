import React, { useState, useEffect } from "react";
import CommentForm from "./CommentForm";
import axios from "axios";
import { FaRegEdit } from "react-icons/fa";
import { FaTrashCan } from "react-icons/fa6";

const PostComments = ({ postId, postUserId, currentUserId }) => {
  const [comments, setComments] = useState([]);
  const [editingComment, setEditingComment] = useState(null); // For tracking the comment being edited

  const fetchComments = async () => {
    try {
      const response = await axios.get(
        `https://blog-backend-git-master-pracatices-projects.vercel.app//api/comments/${postId}`
      );
      setComments(response.data);
    } catch (error) {
      console.error("Error fetching comments:", error);
    }
  };

  useEffect(() => {
    fetchComments();
  }, [postId]);

  const handleLikeComment = async (commentId) => {
    try {
      const token = localStorage.getItem("accessToken");
      await axios.put(
        `https://blog-backend-git-master-pracatices-projects.vercel.app//api/comments/${commentId}/like`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );
      fetchComments(); // Refresh comments
    } catch (error) {
      console.error("Error liking comment:", error);
    }
  };

  const startEditingComment = (comment) => {
    setEditingComment(comment); // Set the comment to be edited
  };

  const handleEditComment = async (commentId, updatedContent) => {
    try {
      const token = localStorage.getItem("accessToken");
      await axios.put(
        `https://blog-backend-git-master-pracatices-projects.vercel.app//api/comments/${commentId}`,
        { content: updatedContent },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setEditingComment(null); // Reset editing state
      fetchComments(); // Refresh comments
    } catch (error) {
      console.error("Error editing comment:", error);
    }
  };

  const handleDeleteComment = async (commentId) => {
    try {
      const token = localStorage.getItem("accessToken");
      await axios.delete(
        `https://blog-backend-git-master-pracatices-projects.vercel.app//api/comments/${commentId}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      fetchComments(); // Refresh comments
    } catch (error) {
      console.error("Error deleting comment:", error);
    }
  };

  return (
    <div className="mt-6">
      <h4 className="text-lg font-semibold mb-2">Comments</h4>
      <ul>
        {comments.map((comment) => {
          const isOwner = comment.user._id === currentUserId;
          const isPostOwner = postUserId === currentUserId;

          return (
            <li key={comment._id} className="border-b py-2">
              {editingComment?._id === comment._id ? (
                // Edit Form
                <form
                  onSubmit={(e) => {
                    e.preventDefault();
                    handleEditComment(comment._id, editingComment.content);
                  }}
                >
                  <textarea
                    value={editingComment.content}
                    onChange={(e) =>
                      setEditingComment({
                        ...editingComment,
                        content: e.target.value,
                      })
                    }
                    className="w-full p-2 border rounded text-black"
                  />
                  <button
                    type="submit"
                    className="bg-blue-500 text-white px-4 py-2 rounded"
                  >
                    Save
                  </button>
                  <button
                    type="button"
                    onClick={() => setEditingComment(null)}
                    className="bg-gray-500 text-white px-4 py-2 rounded"
                  >
                    Cancel
                  </button>
                </form>
              ) : (
                // Comment Display
                <>
                  <p>{comment.content}</p>
                  <small className="text-gray-500">
                    By: {comment.user.name}
                  </small>
                  <div className="flex space-x-4 mt-2">
                    <button
                      onClick={() => handleLikeComment(comment._id)}
                      className={`${
                        comment.likes.includes(currentUserId)
                          ? "text-red-500"
                          : "text-gray-500"
                      }`}
                    >
                      Like ({comment.likes.length})
                    </button>

                    {isOwner && (
                      <>
                        <button
                          onClick={() => startEditingComment(comment)}
                          className="text-yellow-500"
                        >
                          <FaRegEdit />
                        </button>
                        <button
                          onClick={() => handleDeleteComment(comment._id)}
                          className="text-red-500"
                        >
                          <FaTrashCan />
                        </button>
                      </>
                    )}

                    {isPostOwner && !isOwner && (
                      <button
                        onClick={() => handleDeleteComment(comment._id)}
                        className="text-red-500"
                      >
                        Remove
                      </button>
                    )}
                  </div>
                </>
              )}
            </li>
          );
        })}
      </ul>

      <CommentForm postId={postId} fetchComments={fetchComments} />
    </div>
  );
};

export default PostComments;
