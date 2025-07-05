// PostComments.jsx
import React, { useEffect, useState } from "react";
import { collection, query, where, onSnapshot } from "firebase/firestore";
import { db } from "../../firebase";
import CommentForm from "./CommentForm";

const PostComments = ({ postId }) => {
  const [comments, setComments] = useState([]);

  useEffect(() => {
    const q = query(collection(db, "comments"), where("postId", "==", postId));
    const unsubscribe = onSnapshot(q, (querySnapshot) => {
      const fetchedComments = [];
      querySnapshot.forEach((doc) => {
        fetchedComments.push({ id: doc.id, ...doc.data() });
      });
      setComments(
        fetchedComments.sort(
          (a, b) => b.createdAt?.seconds - a.createdAt?.seconds
        )
      );
    });

    return () => unsubscribe();
  }, [postId]);

  return (
    <div className="mt-6">
      <h4 className="text-lg font-semibold mb-2">Comments</h4>
      <ul>
        {comments.map((comment) => (
          <li key={comment.id} className="border-b py-2">
            <p>{comment.content}</p>
            <small className="text-gray-500">By: {comment.userName}</small>
          </li>
        ))}
      </ul>

      <CommentForm postId={postId} fetchComments={() => {}} />
    </div>
  );
};

export default PostComments;
