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
    <div className="modal">
      <div className="modal-content">
        <h2>Create New Post</h2>
        <input
          type="text"
          placeholder="Title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />
        <PostEditor
          value={description}
          onChange={setDescription}
        />
        <button onClick={handleSubmit}>Submit</button>
        <button onClick={onClose}>Cancel</button>
      </div>
    </div>
  );
}
