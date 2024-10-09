// app/posts/page.js

import axios from "axios";
import Link from "next/link";

export default async function PostsPage() {
  // Fetch posts from your Django backend API
  const res = await axios.get("http://localhost:8000/api/posts/");
  const posts = res.data;

  return (
    <div>
      <h1>Posts</h1>
      <ul>
        {posts.map((post) => (
          <li key={post.id}>
            <Link href={`/posts/${post.id}`}>
              {post.title}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
