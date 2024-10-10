// app/components/PostModal.js

'use client';

import React, { useState } from 'react';
import axios from 'axios';
import PostEditor from './PostEditor';

export default function PostModal({ onClose, onPostCreated }) {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');

  const handleSubmit = async () => {
    try {
      const token = localStorage.getItem('authToken');
      await axios.post(
        'http://localhost:8000/api/posts/',
        { title, description },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      onPostCreated();
      onClose();
    } catch (error) {
      console.error(error);
      alert('Error creating post.');
    }
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
      <div className="bg-white rounded-lg shadow-lg p-6 w-full max-w-lg">
        <h2 className="text-2xl font-bold mb-4">Create New Post</h2>
        <input
          type="text"
          placeholder="Title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="border border-gray-300 rounded-md p-2 mb-4 w-full"
        />
        <PostEditor
          value={description}
          onChange={setDescription}
        />
        <div className="flex justify-end space-x-2 mt-4">
          <button
            onClick={handleSubmit}
            className="bg-blue-600 text-white font-semibold px-4 py-2 rounded-md hover:bg-blue-700 transition"
          >
            Submit
          </button>
          <button
            onClick={onClose}
            className="bg-gray-300 text-gray-700 font-semibold px-4 py-2 rounded-md hover:bg-gray-400 transition"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
}
