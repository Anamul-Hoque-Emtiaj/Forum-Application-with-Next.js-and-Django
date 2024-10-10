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
    <div>
      <h3>Comments</h3>
      <textarea
        placeholder="Add a comment"
        value={content}
        onChange={(e) => setContent(e.target.value)}
      ></textarea>
      <button onClick={handleCommentSubmit}>Submit</button>
      <CommentList comments={comments} />
    </div>
  );
}

function CommentList({ comments }) {
  return (
    <ul>
      {comments.map((comment) => (
        <CommentItem
          key={comment.id}
          comment={comment}
        />
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
      // You may need to refresh comments here
    } catch (error) {
      console.error(error);
      alert('Error submitting reply.');
    }
  };

  return (
    <li>
      <p>{comment.content}</p>
      <button onClick={() => setShowReplyBox(!showReplyBox)}>
        Reply
      </button>
      {showReplyBox && (
        <div>
          <textarea
            placeholder="Add a reply"
            value={replyContent}
            onChange={(e) => setReplyContent(e.target.value)}
          ></textarea>
          <button onClick={handleReplySubmit}>
            Submit Reply
          </button>
        </div>
      )}
      {comment.replies && comment.replies.length > 0 && (
        <ul>
          {comment.replies.map((reply) => (
            <CommentItem
              key={reply.id}
              comment={reply}
            />
          ))}
        </ul>
      )}
    </li>
  );
}
