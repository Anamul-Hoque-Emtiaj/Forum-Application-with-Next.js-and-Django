// app/components/PostListItem.js

import React from 'react';
import Link from 'next/link';

export default function PostListItem({ post }) {
  return (
    <div className="bg-white p-4 rounded-lg shadow-md mb-4 hover:shadow-lg transition-shadow">
      <h2 className="text-xl font-bold mb-2">
        <Link href={`/posts/${post.id}`} className="text-blue-600 hover:underline">
          {post.title}
        </Link>
      </h2>
      <p className="text-gray-600 mb-1">
        Date Posted: {new Date(post.date_posted).toLocaleDateString()}
      </p>
      <p className="text-gray-600 mb-1">Comments: {post.comments_count}</p>
      <p className="text-gray-600">
        Issue Solved: {post.is_solved ? 'Yes' : 'No'}
      </p>
    </div>
  );
}
