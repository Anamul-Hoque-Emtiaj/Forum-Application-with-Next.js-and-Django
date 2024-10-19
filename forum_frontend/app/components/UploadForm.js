// components/UploadForm.js

"use client";

import React, { useState } from "react";
import axios from "axios";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";

const UploadForm = () => {
  const { data: session } = useSession();
  const router = useRouter();

  const [videoFile, setVideoFile] = useState(null);
  const [storageProvider, setStorageProvider] = useState("vimeo");
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [visibility, setVisibility] = useState("public");
  const [uploadProgress, setUploadProgress] = useState(0);
  const [statusMessage, setStatusMessage] = useState("");
  const [isUploading, setIsUploading] = useState(false);

  const handleVideoChange = (e) => {
    setVideoFile(e.target.files[0]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!videoFile) {
      setStatusMessage("Please select a video file to upload.");
      return;
    }

    if (!title) {
      setStatusMessage("Please enter a title for your video.");
      return;
    }

    setIsUploading(true);
    setStatusMessage("");

    try {
      let embedUrl = "";

      const formData = new FormData();
      formData.append("title", title);
      formData.append("description", description);
      formData.append("visibility", visibility);
      formData.append("video", videoFile);

      if (storageProvider === "vimeo") {
        const response = await axios.post("/api/upload/vimeo", formData, {
          headers: {
            "Content-Type": "multipart/form-data",
          },
          onUploadProgress: (progressEvent) => {
            const percentCompleted = Math.round(
              (progressEvent.loaded * 100) / progressEvent.total
            );
            setUploadProgress(percentCompleted);
          },
        });

        embedUrl = response.data.embed_url;
      } else if (storageProvider === "youtube") {
        const response = await axios.post("/api/upload/youtube", formData, {
          headers: {
            "Content-Type": "multipart/form-data",
          },
          onUploadProgress: (progressEvent) => {
            const percentCompleted = Math.round(
              (progressEvent.loaded * 100) / progressEvent.total
            );
            setUploadProgress(percentCompleted);
          },
        });

        embedUrl = response.data.embed_url;
      }

      // Send embed URL and other details to the DRF backend
      await axios.post(
        `${process.env.NEXT_PUBLIC_API_BASE_URL_CLIENT}/tutorials/`,
        {
          title,
          description,
          visibility,
          storage_provider: storageProvider,
          embed_url: embedUrl,
        },
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Token ${session.accessToken}`, // Token for DRF Backend authentication
          },
        }
      );

      setStatusMessage("Video uploaded and saved successfully!");
      // Redirect to tutorials page after a short delay
      setTimeout(() => {
        router.push("/tutorials");
      }, 3000);
    } catch (error) {
      console.error("Error uploading video:", error.response?.data || error.message);
      setStatusMessage("Failed to upload video. Please try again.");
    } finally {
      setIsUploading(false);
      setUploadProgress(0);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {/* Video File Input */}
      <div>
        <label htmlFor="videoFile" className="block text-sm font-medium text-gray-700">
          Select Video
        </label>
        <input
          type="file"
          id="videoFile"
          accept="video/*"
          onChange={handleVideoChange}
          required
          className="w-full px-3 py-2 mt-1 border rounded"
        />
      </div>

      {/* Storage Provider Selection */}
      <div>
        <label htmlFor="storageProvider" className="block text-sm font-medium text-gray-700">
          Storage Provider
        </label>
        <select
          id="storageProvider"
          value={storageProvider}
          onChange={(e) => setStorageProvider(e.target.value)}
          required
          className="w-full px-3 py-2 mt-1 border rounded"
        >
          <option value="vimeo">Vimeo</option>
          <option value="youtube">YouTube</option>
        </select>
      </div>

      {/* Video Title */}
      <div>
        <label htmlFor="title" className="block text-sm font-medium text-gray-700">
          Video Title
        </label>
        <input
          type="text"
          id="title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          required
          className="w-full px-3 py-2 mt-1 border rounded"
          placeholder="Enter video title"
        />
      </div>

      {/* Video Description */}
      <div>
        <label htmlFor="description" className="block text-sm font-medium text-gray-700">
          Video Description
        </label>
        <textarea
          id="description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          className="w-full px-3 py-2 mt-1 border rounded"
          placeholder="Enter video description"
          rows="4"
        ></textarea>
      </div>

      {/* Visibility Selection */}
      <div>
        <label htmlFor="visibility" className="block text-sm font-medium text-gray-700">
          Visibility
        </label>
        <select
          id="visibility"
          value={visibility}
          onChange={(e) => setVisibility(e.target.value)}
          required
          className="w-full px-3 py-2 mt-1 border rounded"
        >
          <option value="public">Public</option>
          <option value="unlisted">Unlisted</option>
          <option value="private">Private</option>
        </select>
      </div>

      {/* Upload Progress */}
      {isUploading && (
        <div className="w-full bg-gray-200 rounded-full">
          <div
            className="bg-blue-600 text-xs font-medium text-blue-100 text-center p-0.5 leading-none rounded-full"
            style={{ width: `${uploadProgress}%` }}
          >
            {uploadProgress}%
          </div>
        </div>
      )}

      {/* Status Message */}
      {statusMessage && (
        <p
          className={`text-center ${
            statusMessage.includes("successfully") ? "text-green-600" : "text-red-600"
          }`}
        >
          {statusMessage}
        </p>
      )}

      {/* Submit Button */}
      <div>
        <button
          type="submit"
          disabled={isUploading}
          className="w-full px-4 py-2 font-semibold text-white bg-blue-600 rounded hover:bg-blue-700 disabled:opacity-50"
        >
          {isUploading ? "Uploading..." : "Upload Video"}
        </button>
      </div>
    </form>
  );
};

export default UploadForm;
