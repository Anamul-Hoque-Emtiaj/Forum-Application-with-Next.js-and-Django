'use client';

import React, { useMemo } from 'react';
import dynamic from 'next/dynamic';
import axios from 'axios';
import { useSession } from 'next-auth/react';
import 'react-quill/dist/quill.snow.css';

const ReactQuill = dynamic(() => import('react-quill'), { ssr: false });

const CustomQuill = ({ value, onChange }) => {
  const { data: session } = useSession();
  const quillRef = React.useRef(null);

  const imageHandler = () => {
    const input = document.createElement('input');
    input.setAttribute('type', 'file');
    input.setAttribute('accept', 'image/*');
    input.click();

    input.onchange = async () => {
      const file = input.files[0];

      // Create FormData
      const formData = new FormData();
      formData.append('image', file);

      try {
        const res = await axios.post(
          `${process.env.NEXT_PUBLIC_API_BASE_URL_CLIENT}/posts/upload/`,
          formData,
          {
            headers: {
              'Content-Type': 'multipart/form-data',
              Authorization: `Token ${session?.accessToken}`,
            },
          }
        );

        console.log('Image uploaded:', res.data.url);

        const editor = quillRef.current.getEditor();
        const range = editor.getSelection(true);
        editor.insertEmbed(range.index, 'image', res.data.url);
        editor.setSelection(range.index + 1);
        editor.focus();
      } catch (error) {
        console.error('Error uploading image:', error.response?.data || error.message);
      }
    };
  };

  // Memoize modules to avoid re-initialization
  const modules = useMemo(
    () => ({
      toolbar: {
        container: [
          [{ header: [1, 2, false] }],
          ['bold', 'italic', 'underline', 'strike'],
          [{ list: 'ordered' }, { list: 'bullet' }],
          ['link', 'image'],
          ['clean'],
        ],
        handlers: {
          image: imageHandler,
        },
      },
    }),
    []
  );

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

  return (
    <ReactQuill
      ref={quillRef}
      value={value}
      onChange={onChange}
      modules={modules}
      formats={formats}
      style={{ height: '300px', width: '100%' }}
    />
  );
};

export default CustomQuill;
