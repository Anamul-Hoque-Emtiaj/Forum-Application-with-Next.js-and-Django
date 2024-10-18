'use client';

import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Link from 'next/link';
import { useSession } from 'next-auth/react';
import dynamic from 'next/dynamic';
import CustomQuill from '../components/CustomQuill';

const ReactQuill = dynamic(() => import('react-quill'), { ssr: false });

const PostsPage = () => {
  const { data: session, status } = useSession();
  const loading = status === 'loading';

  const [posts, setPosts] = useState([]);
  const [page, setPage] = useState(1);
  const [hasNext, setHasNext] = useState(false);
  const [hasPrev, setHasPrev] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [newPostTitle, setNewPostTitle] = useState('');
  const [newPostDescription, setNewPostDescription] = useState('');
  const [loadingPosts, setLoadingPosts] = useState(false);

  useEffect(() => {
    const fetchPosts = async () => {
      setLoadingPosts(true);
      try {
        const res = await axios.get(`${process.env.NEXT_PUBLIC_API_BASE_URL_CLIENT}/posts/?page=${page}`);
        setPosts(res.data.results);
        setHasNext(res.data.next !== null);
        setHasPrev(res.data.previous !== null);
      } catch (error) {
        console.error('Error fetching posts:', error.response?.data || error.message);
      } finally {
        setLoadingPosts(false);
      }
    };

    fetchPosts();
  }, [page]);

  const handlePagination = (direction) => {
    if (direction === 'next' && hasNext) setPage(prev => prev + 1);
    if (direction === 'prev' && hasPrev) setPage(prev => prev - 1);
  };

  const handleCreatePost = async () => {
    if (!session) {
      alert('Please log in to create a post.');
      return;
    }

    try {
      await axios.post(`${process.env.NEXT_PUBLIC_API_BASE_URL_CLIENT}/posts/create/`, {
        title: newPostTitle,
        description: newPostDescription,
      }, {
        headers: {
          Authorization: `Token ${session.accessToken}`,
        },
      });
      // Close modal and refresh posts
      setShowModal(false);
      setNewPostTitle('');
      setNewPostDescription('');
      setPage(1);  // Refresh to first page
    } catch (error) {
      console.error('Error creating post:', error.response?.data || error.message);
    }
  };

  return (
    <div className="container mx-auto px-4 py-6">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold">Posts</h1>
        <button
          onClick={() => setShowModal(true)}
          className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
        >
          Create Post
        </button>
      </div>

      {loadingPosts ? (
        <div>Loading posts...</div>
      ) : (
        <>
          <ul>
            {posts.length > 0 ? (
              posts.map(post => (
                <li key={post.id} className="p-4 border-b">
                  <Link href={`/posts/${post.id}`} className="block">
                    <div className="flex justify-between items-center">
                      <span className="text-xl font-semibold">{post.title}</span>
                      <span className="text-sm text-gray-500">{post.created_at}</span>
                      <span className="text-sm text-gray-500">{post.author_username}</span>
                    </div>
                  </Link>
                </li>
              ))
            ) : (
              <li className="p-4 text-center text-gray-500">No posts found.</li>
            )}
          </ul>

          <div className="flex justify-between mt-4">
            <button
              onClick={() => handlePagination('prev')}
              disabled={!hasPrev}
              className={`px-4 py-2 bg-blue-600 text-white rounded ${!hasPrev ? 'opacity-50 cursor-not-allowed' : 'hover:bg-blue-700'}`}
            >
              Previous
            </button>
            <button
              onClick={() => handlePagination('next')}
              disabled={!hasNext}
              className={`px-4 py-2 bg-blue-600 text-white rounded ${!hasNext ? 'opacity-50 cursor-not-allowed' : 'hover:bg-blue-700'}`}
            >
              Next
            </button>
          </div>
        </>
      )}

      {/* Create Post Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 overflow-auto bg-smoke-light flex">
          <div
            className="relative p-8 bg-white w-full max-w-2xl m-auto rounded-lg"
            style={{ maxHeight: '90vh' }}
          >
            <h2 className="text-xl font-bold mb-4">Create Post</h2>
            <input
              type="text"
              placeholder="Title"
              value={newPostTitle}
              onChange={(e) => setNewPostTitle(e.target.value)}
              className="w-full p-2 border mb-4"
            />
            <div className="overflow-auto mb-4" style={{ height: '300px' }}>
              <CustomQuill
                value={newPostDescription}
                onChange={setNewPostDescription}
              />
            </div>
            <div className="flex justify-end mt-4">
              <button
                onClick={() => setShowModal(false)}
                className="px-4 py-2 mr-2 bg-gray-300 rounded hover:bg-gray-400"
              >
                Cancel
              </button>
              <button
                onClick={handleCreatePost}
                className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
              >
                Create
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};

export default PostsPage;
