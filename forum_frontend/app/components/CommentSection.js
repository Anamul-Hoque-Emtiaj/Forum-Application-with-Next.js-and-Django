// app/components/CommentSection.js

'use client';

import React, { useState, useEffect } from 'react';
import axios from 'axios';

export default function CommentSection({ postId }) {
  const [comments, setComments] = useState([]);
  const [content, setContent] = useState('');

  const fetchComments = async () => {
    try {
      const res = await axios.get(
        `http://localhost:8000/api/posts/${postId}/comments/`
      );
      setComments(res.data);
    } catch (error) {
      console.error(error);
    }
  };

  const handleCommentSubmit = async () => {
    try {
      const token = localStorage.getItem('authToken');
      await axios.post(
        `http://localhost:8000/api/posts/${postId}/comments/`,
        { content },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setContent('');
      fetchComments();
    } catch (error) {
      console.error(error);
      alert('Error submitting comment.');
    }
  };

  useEffect(() => {
    fetchComments();
  }, [postId]);

  return (
    <div className="mt-4 p-4 border rounded-lg shadow-lg bg-white dark:bg-gray-800">
      <h3 className="text-xl font-semibold mb-4">Comments</h3>
      <div className="mb-4">
        <textarea
          className="w-full h-24 p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
          placeholder="Add a comment"
          value={content}
          onChange={(e) => setContent(e.target.value)}
        ></textarea>
        <button
          onClick={handleCommentSubmit}
          className="mt-2 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors duration-200"
        >
          Submit
        </button>
      </div>
      <CommentList comments={comments} />
    </div>
  );
}

function CommentList({ comments }) {
  return (
    <ul className="divide-y divide-gray-200">
      {comments.map((comment) => (
        <CommentItem key={comment.id} comment={comment} />
      ))}
    </ul>
  );
}

function CommentItem({ comment }) {
  const [replyContent, setReplyContent] = useState('');
  const [showReplyBox, setShowReplyBox] = useState(false);

  const handleReplySubmit = async () => {
    try {
      const token = localStorage.getItem('authToken');
      await axios.post(
        `http://localhost:8000/api/comments/`,
        {
          content: replyContent,
          parent: comment.id,
          post: comment.post,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setReplyContent('');
      setShowReplyBox(false);
      // Refresh comments if necessary
    } catch (error) {
      console.error(error);
      alert('Error submitting reply.');
    }
  };

  return (
    <li className="py-2">
      <p className="text-gray-800 dark:text-gray-200">{comment.content}</p>
      <button
        onClick={() => setShowReplyBox(!showReplyBox)}
        className="mt-2 text-blue-500 hover:underline"
      >
        Reply
      </button>
      {showReplyBox && (
        <div className="mt-2">
          <textarea
            className="w-full h-20 p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
            placeholder="Add a reply"
            value={replyContent}
            onChange={(e) => setReplyContent(e.target.value)}
          ></textarea>
          <button
            onClick={handleReplySubmit}
            className="mt-2 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors duration-200"
          >
            Submit Reply
          </button>
        </div>
      )}
      {comment.replies && comment.replies.length > 0 && (
        <ul className="mt-4 ml-4">
          {comment.replies.map((reply) => (
            <CommentItem key={reply.id} comment={reply} />
          ))}
        </ul>
      )}
    </li>
  );
}
