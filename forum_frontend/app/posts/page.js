// app/posts/page.js

'use client';

import React, { useState, useEffect } from 'react';
import axios from 'axios';
import PostListItem from '../components/PostListItem';
import PostModal from '../components/PostModal';

export default function PostsPage() {
  const [posts, setPosts] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const fetchPosts = async () => {
    try {
      const res = await axios.get('http://localhost:8000/api/posts/');
      setPosts(res.data);
    } catch (error) {
      console.error(error);
    }
  };

  const handlePostCreated = () => {
    fetchPosts();
  };

  useEffect(() => {
    fetchPosts();
  }, []);

  return (
    <div>
      <h1>Forum Posts</h1>
      <button onClick={() => setIsModalOpen(true)}>
        Add New Post
      </button>
      {posts.map((post) => (
        <PostListItem key={post.id} post={post} />
      ))}
      {isModalOpen && (
        <PostModal
          onClose={() => setIsModalOpen(false)}
          onPostCreated={handlePostCreated}
        />
      )}
    </div>
  );
}
