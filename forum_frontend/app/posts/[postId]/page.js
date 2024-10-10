// app/posts/[postId]/page.js

'use client';

import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams } from 'next/navigation';
import DOMPurify from 'dompurify';
import CommentSection from '../../components/CommentSection';

export default function PostDetailPage() {
  const { postId } = useParams();
  const [post, setPost] = useState(null);

  const fetchPost = async () => {
    try {
      const res = await axios.get(
        `http://localhost:8000/api/posts/${postId}/`
      );
      setPost(res.data);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    fetchPost();
  }, [postId]);

  if (!post) return <p className="text-center">Loading...</p>;

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-2">{post.title}</h1>
      <p className="text-gray-600 mb-4">
        <strong>Issue Solved:</strong> {post.is_solved ? 'Yes' : 'No'}
      </p>
      <div
        className="prose lg:prose-xl mb-4"
        dangerouslySetInnerHTML={{
          __html: DOMPurify.sanitize(post.description),
        }}
      />
      <CommentSection postId={postId} />
    </div>
  );
}
