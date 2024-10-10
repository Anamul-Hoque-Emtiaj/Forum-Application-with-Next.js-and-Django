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
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-4">Forum Posts</h1>
      <button
        onClick={() => setIsModalOpen(true)}
        className="bg-blue-600 text-white font-semibold px-4 py-2 rounded-md hover:bg-blue-700 transition mb-4"
      >
        Add New Post
      </button>
      <div className="space-y-4">
        {posts.map((post) => (
          <PostListItem key={post.id} post={post} />
        ))}
      </div>
      {isModalOpen && (
        <PostModal
          onClose={() => setIsModalOpen(false)}
          onPostCreated={handlePostCreated}
        />
      )}
    </div>
  );
}
