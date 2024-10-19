// app/tutorials/page.js

"use client";

import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useSession } from 'next-auth/react';
import Link from 'next/link';

const Tutorials = () => {
  const { data: session, status } = useSession();
  const [videos, setVideos] = useState([]);
  const [statusMessage, setStatusMessage] = useState('');

  useEffect(() => {
    const fetchVideos = async () => {
      try {
        const response = await axios.get(`${process.env.NEXT_PUBLIC_API_BASE_URL_CLIENT}/tutorials/`, {
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Token ${session?.accessToken}`, // Token for DRF Backend authentication
          },
        });
        setVideos(response.data);
      } catch (error) {
        console.error('Error fetching videos:', error.response?.data || error.message);
        setStatusMessage('Failed to load videos.');
      }
    };

    if (session) {
      fetchVideos();
    }
  }, [session]);

  if (status === 'loading') {
    return <p className="text-center mt-10">Loading...</p>;
  }

  return (
    <div className="min-h-screen bg-gray-100 p-4">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl text-black font-bold">Video Tutorials</h1>
        {session && (
          <Link href="/auth/video-upload" className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700">
            Upload Video
          </Link>
        )}
      </div>

      {statusMessage && (
        <p className="text-center text-red-600 mb-4">{statusMessage}</p>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {videos.length > 0 ? (
          videos.map((video) => (
            <div key={video.id} className="bg-white rounded shadow p-4">
              <h2 className="text-xl font-semibold mb-2">{video.title}</h2>
              <p className="text-gray-600 mb-4">{video.description}</p>
              <div className="aspect-w-16 aspect-h-9">
                <iframe
                  src={video.embed_url}
                  title={video.title}
                  frameBorder="0"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                  className="w-full h-full rounded"
                ></iframe>
              </div>
              <p className="text-sm text-gray-500 mt-2">Uploaded by: {video.uploader}</p>
            </div>
          ))
        ) : (
          <p className="text-center text-black col-span-full">No tutorials available.</p>
        )}
      </div>
    </div>
  );
};

export default Tutorials;
