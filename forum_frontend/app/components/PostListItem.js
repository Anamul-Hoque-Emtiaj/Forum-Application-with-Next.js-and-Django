// app/components/PostListItem.js

import React from 'react';
import Link from 'next/link';

export default function PostListItem({ post }) {
  return (
    <div>
      <h2>
        <Link href={`/posts/${post.id}`}>{post.title}</Link>
      </h2>
      <p>Date Posted: {new Date(post.date_posted).toLocaleDateString()}</p>
      <p>Comments: {post.comments_count}</p>
      <p>Issue Solved: {post.is_solved ? 'Yes' : 'No'}</p>
    </div>
  );
}
