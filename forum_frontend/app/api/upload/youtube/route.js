// app/api/upload/youtube/route.js

import { NextResponse } from 'next/server';
import axios from 'axios';
import Busboy from 'busboy';
import fs from 'fs';
import path from 'path';
import { getToken } from 'next-auth/jwt';

export const runtime = 'nodejs';

export const config = {
  api: {
    bodyParser: false,
  },
};

export async function POST(req) {
  // Retrieve the token from the request's cookies
  const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });

  // Check if the token exists and contains YouTube access tokens
  if (
    !token ||
    !token.youtubeAccessToken ||
    !token.youtubeRefreshToken ||
    !token.youtubeExpiresAt
  ) {
    return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
  }

  const busboy = new Busboy({ headers: req.headers });

  const fields = {};
  const files = {};

  const uploadDir = path.join(process.cwd(), '/uploads');

  // Ensure the uploads directory exists
  if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir);
  }

  return new Promise((resolve, reject) => {
    busboy.on('field', (fieldname, val) => {
      fields[fieldname] = val;
    });

    busboy.on('file', (fieldname, file, filename, encoding, mimetype) => {
      const saveTo = path.join(uploadDir, path.basename(filename));
      const writeStream = fs.createWriteStream(saveTo);
      file.pipe(writeStream);

      files[fieldname] = { filepath: saveTo, mimetype, size: 0 };

      file.on('data', (data) => {
        files[fieldname].size += data.length;
      });

      file.on('end', () => {
        // File upload finished
      });
    });

    busboy.on('finish', async () => {
      try {
        const { title, description, visibility } = fields;
        const videoFile = files.video;

        if (!videoFile) {
          resolve(NextResponse.json({ message: 'No video file uploaded.' }, { status: 400 }));
          return;
        }

        // Optional: Validate file type and size
        const allowedTypes = ['video/mp4', 'video/mov', 'video/avi'];
        if (!allowedTypes.includes(videoFile.mimetype)) {
          resolve(NextResponse.json({ message: 'Unsupported video format.' }, { status: 400 }));
          return;
        }

        const maxSize = 500 * 1024 * 1024; // 500 MB
        if (videoFile.size > maxSize) {
          resolve(NextResponse.json({ message: 'Video file is too large.' }, { status: 400 }));
          return;
        }

        const youtubeAccessToken = token.youtubeAccessToken;

        // Step 1: Upload the video using YouTube Data API v3
        const videoData = new FormData();
        videoData.append(
          'snippet',
          JSON.stringify({
            title: title,
            description: description,
            tags: [],
            categoryId: '22', // People & Blogs
          })
        );
        videoData.append(
          'status',
          JSON.stringify({
            privacyStatus: visibility, // 'public', 'private', or 'unlisted'
          })
        );
        videoData.append('file', fs.createReadStream(videoFile.filepath));

        const response = await axios.post(
          'https://www.googleapis.com/upload/youtube/v3/videos',
          videoData,
          {
            params: {
              part: 'snippet,status',
              uploadType: 'multipart',
            },
            headers: {
              Authorization: `Bearer ${youtubeAccessToken}`,
              ...videoData.getHeaders(),
            },
            maxContentLength: Infinity,
            maxBodyLength: Infinity,
          }
        );

        const videoId = response.data.id;
        const embedUrl = `https://www.youtube.com/embed/${videoId}`;

        // Clean up uploaded file
        fs.unlinkSync(videoFile.filepath);

        resolve(NextResponse.json({ embed_url: embedUrl }, { status: 200 }));
      } catch (error) {
        console.error('YouTube Upload Error:', error.response?.data || error.message);
        resolve(NextResponse.json({ message: 'YouTube upload failed.' }, { status: 500 }));
      }
    });

    busboy.on('error', (err) => {
      console.error('Busboy Error:', err);
      reject(err);
    });

    req.pipe(busboy);
  });
}
