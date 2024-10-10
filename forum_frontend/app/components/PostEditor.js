// app/components/PostEditor.js

'use client';

import React, { useMemo } from 'react';
import dynamic from 'next/dynamic';
import 'react-quill/dist/quill.snow.css';
import api from '../../utils/api';

const ReactQuill = dynamic(
  () => import('react-quill'),
  { ssr: false }
);

export default function PostEditor({ value, onChange }) {
  const imageHandler = () => {
    const input = document.createElement('input');
    input.setAttribute('type', 'file');
    input.setAttribute('accept', 'image/*');
    input.click();

    input.onchange = async () => {
      const file = input.files[0];
      if (file) {
        // Prepare form data
        const formData = new FormData();
        formData.append('image', file);

        try {
          // Upload image to the backend
          const res = await api.post('/upload/', formData, {
            headers: {
              'Content-Type': 'multipart/form-data',
            },
          });

          // Insert the image into the editor
          const quill = quillRef.current.getEditor();
          const range = quill.getSelection();
          quill.insertEmbed(range.index, 'image', res.data.url);
        } catch (error) {
          console.error('Error uploading image:', error);
          alert('Failed to upload image. Please try again.');
        }
      }
    };
  };

  const modules = useMemo(() => ({
    toolbar: {
      container: [
        [{ header: [1, 2, false] }],
        ['bold', 'italic', 'underline', 'strike'],
        [{ list: 'ordered' }, { list: 'bullet' }],
        ['link', 'image'],
      ],
      handlers: {
        image: imageHandler,
      },
    },
  }), []);

  const formats = [
    'header',
    'bold',
    'italic',
    'underline',
    'strike',
    'list',
    'bullet',
    'link',
    'image',
  ];

  // Create a ref to access the Quill editor instance
  const quillRef = React.useRef(null);

  return (
    <ReactQuill
      ref={quillRef}
      value={value}
      onChange={onChange}
      modules={modules}
      formats={formats}
      theme="snow"
    />
  );
}
