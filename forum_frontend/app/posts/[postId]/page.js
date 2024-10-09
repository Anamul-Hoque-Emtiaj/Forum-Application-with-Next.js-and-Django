// app/posts/[postId]/page.js

import axios from "axios";

export default async function PostPage({ params }) {
  const { postId } = params;

  // Fetch the individual post from your backend API
  const res = await axios.get(`http://localhost:8000/api/posts/${postId}/`);
  const post = res.data;

  return (
    <div>
      <h1>{post.title}</h1>
      <p>{post.content}</p>
      {/* Add any other post details you need */}
    </div>
  );
}
