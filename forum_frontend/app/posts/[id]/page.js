'use client';

import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useRouter, usePathname } from 'next/navigation';
import { useSession } from 'next-auth/react';
import DOMPurify from 'dompurify';

const PostDetailPage = () => {
  const { data: session } = useSession();
  const router = useRouter();
  const pathname = usePathname();
  const postId = pathname.split('/').pop();

  const [post, setPost] = useState(null);
  const [commentContent, setCommentContent] = useState('');
  const [loadingPost, setLoadingPost] = useState(false);
  const [loadingComments, setLoadingComments] = useState(false);

  useEffect(() => {
    const fetchPost = async () => {
      setLoadingPost(true);
      try {
        const res = await axios.get(`${process.env.NEXT_PUBLIC_API_BASE_URL_CLIENT}/posts/${postId}/`);
        setPost(res.data);
      } catch (error) {
        console.error('Error fetching post:', error.response?.data || error.message);
      } finally {
        setLoadingPost(false);
      }
    };

    fetchPost();
  }, [postId]);

  const handleAddComment = async () => {
    if (!session) {
      alert('Please log in to add a comment.');
      return;
    }

    if (!commentContent.trim()) {
      alert('Comment cannot be empty.');
      return;
    }

    try {
      await axios.post(`${process.env.NEXT_PUBLIC_API_BASE_URL_CLIENT}/posts/${postId}/add-comment/`, {
        content: commentContent,
      }, {
        headers: {
          Authorization: `Token ${session.accessToken}`,
        },
      });
      // Refresh post to get updated comments
      setCommentContent('');
      const res = await axios.get(`${process.env.NEXT_PUBLIC_API_BASE_URL_CLIENT}/posts/${postId}/`);
      setPost(res.data);
    } catch (error) {
      console.error('Error adding comment:', error.response?.data || error.message);
    }
  };

  const sanitizeDescription = (description) => {
    return DOMPurify.sanitize(description);
  };

  if (loadingPost) {
    return <div className="container mx-auto p-4">Loading post...</div>;
  }

  if (!post) {
    return <div className="container mx-auto p-4">Post not found.</div>;
  }

  return (
    <div className="container mx-auto px-4 py-6">
      <h1 className="text-3xl font-bold mb-4">{post.title}</h1>
      <div
        className="prose mb-6"
        dangerouslySetInnerHTML={{ __html: sanitizeDescription(post.description) }}
      />
      <h2 className="text-2xl font-semibold mb-2">Comments</h2>
      <ul className="mb-4">
        {post.comments && post.comments.length > 0 ? (
          post.comments.map(comment => (
            <li key={comment.id} className="border-b py-2">
              <p className="font-semibold">{comment.author_username}</p>
              <p>{comment.content}</p>
              {/* Replies */}
              {comment.replies && comment.replies.length > 0 && (
                <ul className="ml-4 mt-2">
                  {comment.replies.map(reply => (
                    <li key={reply.id} className="border-b py-1">
                      <p className="font-semibold">{reply.author_username}</p>
                      <p>{reply.content}</p>
                    </li>
                  ))}
                </ul>
              )}
              {/* Reply to Comment */}
              <ReplyToComment
                commentId={comment.id}
                postId={postId}
                session={session}
                onReplyAdded={() => {
                  // Refresh post to get updated comments
                  axios.get(`${process.env.NEXT_PUBLIC_API_BASE_URL_CLIENT}/posts/${postId}/`)
                    .then(res => setPost(res.data))
                    .catch(error => console.error(error));
                }}
              />
            </li>
          ))
        ) : (
          <li>No comments yet.</li>
        )}
      </ul>
      {/* Add Comment */}
      <div className="mt-4">
        <h3 className="text-xl font-semibold mb-2">Add a Comment</h3>
        <textarea
          value={commentContent}
          onChange={(e) => setCommentContent(e.target.value)}
          className="w-full p-2 border rounded mb-2"
          rows="4"
          placeholder="Your comment..."
        />
        <button
          onClick={handleAddComment}
          className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
        >
          Submit
        </button>
      </div>
    </div>
  );
};

const ReplyToComment = ({ commentId, postId, session, onReplyAdded }) => {
  const [replyContent, setReplyContent] = useState('');
  const [showReplyField, setShowReplyField] = useState(false);

  const handleAddReply = async () => {
    if (!session) {
      alert('Please log in to reply.');
      return;
    }

    if (!replyContent.trim()) {
      alert('Reply cannot be empty.');
      return;
    }

    try {
      await axios.post(`${process.env.NEXT_PUBLIC_API_BASE_URL_CLIENT}/comments/${commentId}/add-reply/`, {
        content: replyContent,
      }, {
        headers: {
          Authorization: `Token ${session.accessToken}`,
        },
      });
      setReplyContent('');
      setShowReplyField(false);
      onReplyAdded();
    } catch (error) {
      console.error('Error adding reply:', error.response?.data || error.message);
    }
  };

  return (
    <div className="mt-2">
      {showReplyField ? (
        <>
          <textarea
            value={replyContent}
            onChange={(e) => setReplyContent(e.target.value)}
            className="w-full p-2 border rounded mb-2"
            rows="3"
            placeholder="Your reply..."
          />
          <div className="flex items-center">
            <button
              onClick={handleAddReply}
              className="px-3 py-1 bg-blue-600 text-white rounded hover:bg-blue-700 mr-2"
            >
              Reply
            </button>
            <button
              onClick={() => setShowReplyField(false)}
              className="px-3 py-1 bg-gray-300 rounded hover:bg-gray-400"
            >
              Cancel
            </button>
          </div>
        </>
      ) : (
        <button
          onClick={() => setShowReplyField(true)}
          className="text-blue-600 hover:underline"
        >
          Reply
        </button>
      )}
    </div>
  );
};

export default PostDetailPage;
