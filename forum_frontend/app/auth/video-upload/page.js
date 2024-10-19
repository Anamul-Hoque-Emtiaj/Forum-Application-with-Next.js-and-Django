// app/auth/video-upload/page.js

import React from 'react';
import ProtectedRoute from '../../components/common/ProtectedRoute';
import UploadForm from '../../components/UploadForm';

const VideoUploadPage = () => {
  return (
    <ProtectedRoute>
      <div className="flex items-center justify-center min-h-screen bg-gray-100 p-4">
        <div className="w-full max-w-lg p-8 space-y-6 bg-white rounded shadow">
          <h1 className="text-2xl font-bold text-center">Upload Video Tutorial</h1>
          <UploadForm />
        </div>
      </div>
    </ProtectedRoute>
  );
};

export default VideoUploadPage;
