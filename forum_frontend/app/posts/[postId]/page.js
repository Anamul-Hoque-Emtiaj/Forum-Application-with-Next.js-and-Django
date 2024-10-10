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

  if (!post) return <p>Loading...</p>;

  return (
    <div>
      <h1>{post.title}</h1>
      <p>Issue Solved: {post.is_solved ? 'Yes' : 'No'}</p>
      <div
        dangerouslySetInnerHTML={{
          __html: DOMPurify.sanitize(post.description),
        }}
      />
      <CommentSection postId={postId} />
    </div>
  );
}
