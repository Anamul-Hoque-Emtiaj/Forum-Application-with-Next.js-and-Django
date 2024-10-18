// app/components/ReplyToComment.js

'use client';

import React, { useState } from 'react';
import { clientApi } from '../../utils/api'; // Adjust the import path as necessary

const ReplyToComment = ({ commentId, postId, session, onReplyAdded }) => {
  const [replyContent, setReplyContent] = useState('');
  const [showReplyField, setShowReplyField] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');

  const handleAddReply = async () => {
    if (!session) {
      alert('Please log in to reply.');
      return;
    }

    if (!replyContent.trim()) {
      alert('Reply cannot be empty.');
      return;
    }

    setIsSubmitting(true);
    setError('');

    try {
      await clientApi.post(
        `/comments/${commentId}/add-reply/`,
        { content: replyContent },
        {
          headers: {
            Authorization: `Token ${session.accessToken}`,
          },
        }
      );
      setReplyContent('');
      setShowReplyField(false);
      onReplyAdded();
    } catch (err) {
      console.error('Error adding reply:', err.response?.data || err.message);
      setError('Failed to add reply. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="mt-2">
      {showReplyField ? (
        <div className="flex flex-col">
          <textarea
            value={replyContent}
            onChange={(e) => setReplyContent(e.target.value)}
            className="w-full p-2 border rounded mb-2"
            rows="3"
            placeholder="Your reply..."
            disabled={isSubmitting}
          />
          {error && <p className="text-red-500 text-sm mb-2">{error}</p>}
          <div className="flex items-center">
            <button
              onClick={handleAddReply}
              className={`px-3 py-1 bg-blue-600 text-white rounded hover:bg-blue-700 mr-2 ${
                isSubmitting ? 'opacity-50 cursor-not-allowed' : ''
              }`}
              disabled={isSubmitting}
            >
              {isSubmitting ? 'Replying...' : 'Reply'}
            </button>
            <button
              onClick={() => {
                setShowReplyField(false);
                setReplyContent('');
                setError('');
              }}
              className="px-3 py-1 bg-gray-300 text-gray-700 rounded hover:bg-gray-400"
              disabled={isSubmitting}
            >
              Cancel
            </button>
          </div>
        </div>
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

export default ReplyToComment;
