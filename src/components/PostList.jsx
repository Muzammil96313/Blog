import React, { useEffect, useState } from "react";
import { NavLink } from "react-router-dom";
import { FaTrashCan } from "react-icons/fa6";
import { FaRegEdit } from "react-icons/fa";
import { AiOutlineDislike, AiOutlineLike } from "react-icons/ai";
import { getAuth } from "firebase/auth";
import {
  collection,
  getDocs,
  doc,
  deleteDoc,
  updateDoc,
  arrayUnion,
  arrayRemove,
} from "firebase/firestore";
import { db, auth } from "../../firebase"; // <-- apne firebase config ka path sahi se dena

import PostComments from "./PostComments";
import EditPostForm from "./EditPostForm";

const PostList = () => {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [editingPostId, setEditingPostId] = useState(null);
  const [deletePostId, setDeletePostId] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [isLikeButtonDisabled, setIsLikeButtonDisabled] = useState(null);

  const currentUser = auth.currentUser;
  const currentUserId = currentUser?.uid || null;

  const fetchPosts = async () => {
    setLoading(true);
    try {
      const querySnapshot = await getDocs(collection(db, "posts"));
      const postsArray = [];
      querySnapshot.forEach((docSnap) => {
        postsArray.push({ ...docSnap.data(), id: docSnap.id });
      });
      setPosts(postsArray);
    } catch (error) {
      console.error("Error fetching posts:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPosts();
  }, []);

  const handleDelete = async () => {
    if (!deletePostId) return;

    try {
      setLoading(true);
      await deleteDoc(doc(db, "posts", deletePostId));
      fetchPosts();
      setShowModal(false);
    } catch (error) {
      console.error("Error deleting post:", error);
    } finally {
      setLoading(false);
      setDeletePostId(null);
    }
  };

  const handleLike = async (postId, isLiked) => {
    if (isLikeButtonDisabled) return;
    setIsLikeButtonDisabled(true);

    try {
      const postRef = doc(db, "posts", postId);

      await updateDoc(postRef, {
        likes: isLiked ? arrayRemove(currentUserId) : arrayUnion(currentUserId),
      });

      fetchPosts();
    } catch (error) {
      console.error("Error updating like:", error);
    } finally {
      setIsLikeButtonDisabled(false);
    }
  };

  return (
    <div className="dark:bg-gray-900 dark:text-white min-h-[100vh] max-h-full pb-10">
      <div className="container">
        {/* Header */}
        <div className="flex items-center justify-between mb-4 py-10">
          <h2 className="text-4xl font-bold">All Posts</h2>
          <NavLink
            className="bg-blue-500 hover:bg-blue-700 font-bold py-2 px-4 rounded"
            to="/create"
          >
            Create Post
          </NavLink>
        </div>

        {loading && <p className="text-center text-blue-500">Processing...</p>}

        <ul className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {posts.map((post, index) => {
            const isLikedByCurrentUser = post.likes?.includes(currentUserId);

            return (
              <li
                className="py-8 px-4 shadow-lg rounded-lg bg-white text-black dark:bg-gray-700 dark:text-white h-auto"
                key={post.id}
              >
                {editingPostId === post.id ? (
                  <EditPostForm
                    postId={post.id}
                    post={post}
                    onCancel={() => setEditingPostId(null)}
                    onUpdate={fetchPosts}
                  />
                ) : (
                  <>
                    <span className="text-xl font-bold text-gray-500">
                      No. {index + 1}
                    </span>
                    <h3 className="text-3xl font-semibold mb-2">
                      {post.title}
                    </h3>
                    <ExpandableContent content={post.content} />

                    <div className="flex justify-between items-center mt-4">
                      <button
                        onClick={() =>
                          handleLike(post.id, isLikedByCurrentUser)
                        }
                        className={`${
                          isLikedByCurrentUser
                            ? "bg-red-500 hover:bg-red-700"
                            : "bg-green-500 hover:bg-green-700"
                        } text-white font-bold py-1 px-3 rounded`}
                        disabled={isLikeButtonDisabled}
                      >
                        {isLikedByCurrentUser ? (
                          <AiOutlineDislike className="text-2xl" />
                        ) : (
                          <AiOutlineLike className="text-2xl" />
                        )}
                      </button>

                      {post.userId === currentUserId && (
                        <div className="flex items-center gap-6">
                          <button
                            onClick={() => {
                              setDeletePostId(post.id);
                              setShowModal(true);
                            }}
                            className="bg-red-500 hover:bg-red-700 text-white font-bold py-1 px-3 rounded"
                          >
                            <FaTrashCan className="text-2xl" />
                          </button>
                          <button
                            onClick={() => setEditingPostId(post.id)}
                            className="bg-yellow-500 hover:bg-yellow-700 text-white font-bold py-1 px-3 rounded"
                          >
                            <FaRegEdit className="text-2xl" />
                          </button>
                        </div>
                      )}
                    </div>

                    <p className="text-gray-500 mt-2">
                      Likes: {post.likes?.length || 0}
                    </p>

                    {/* Author info */}
                    <div className="flex items-center mt-2">
                      {post.avatarUrl ? (
                        <img
                          src={post.avatarUrl}
                          alt="Avatar"
                          className="w-8 h-8 rounded-full mr-2"
                        />
                      ) : (
                        <div className="w-8 h-8 bg-gray-300 rounded-full mr-2"></div>
                      )}
                      <small className="text-gray-500">
                        By: {post.authorName || "Unknown"}
                      </small>
                    </div>

                    {/* Comments */}
                    <div className="mt-4">
                      <PostComments
                        postId={post.id}
                        postUserId={post.userId}
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
                  onClick={() => setShowModal(false)}
                  className="bg-gray-500 hover:bg-gray-700 text-white font-bold py-1 px-3 rounded"
                >
                  No
                </button>
                <button
                  onClick={handleDelete}
                  className="bg-red-500 hover:bg-red-700 text-white font-bold py-1 px-3 rounded"
                >
                  Yes
                </button>
              </div>
            </div>
          </div>
        )}

        {posts.length === 0 && !loading && (
          <p className="text-center text-gray-500 mt-4">No posts available.</p>
        )}
      </div>
    </div>
  );
};

const ExpandableContent = ({ content }) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const maxWords = 12;

  const toggleContent = () => setIsExpanded(!isExpanded);

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
