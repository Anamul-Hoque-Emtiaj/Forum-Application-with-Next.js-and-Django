// app/api/upload/vimeo/route.js

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

  // Check if the token exists and contains the backend access token
  if (!token || !token.accessToken) {
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

        const vimeoAccessToken = process.env.VIMEO_ACCESS_TOKEN;
        if (!vimeoAccessToken) {
          throw new Error('Vimeo access token not configured.');
        }

        // Step 1: Create an upload ticket
        const createResponse = await axios.post(
          'https://api.vimeo.com/me/videos',
          {
            upload: {
              approach: 'tus',
              size: videoFile.size,
            },
            name: title,
            description: description,
            privacy: {
              view: visibility,
            },
          },
          {
            headers: {
              Authorization: `bearer ${vimeoAccessToken}`,
              'Content-Type': 'application/json',
            },
          }
        );

        const uploadLink = createResponse.data.upload.upload_link;
        const videoUri = createResponse.data.uri;

        // Step 2: Upload the video file using Tus protocol
        const fileStream = fs.createReadStream(videoFile.filepath);

        await axios.patch(uploadLink, fileStream, {
          headers: {
            'Content-Type': 'application/offset+octet-stream',
            'Tus-Resumable': '1.0.0',
            'Upload-Offset': 0,
          },
          maxContentLength: Infinity,
          maxBodyLength: Infinity,
        });

        // Step 3: Retrieve the embed URL
        const videoResponse = await axios.get(`https://api.vimeo.com${videoUri}`, {
          headers: {
            Authorization: `bearer ${vimeoAccessToken}`,
            'Content-Type': 'application/json',
          },
        });

        const embedHtml = videoResponse.data.embed.html;
        const embedUrlMatch = embedHtml.match(/src="([^"]+)"/);
        const embedUrl = embedUrlMatch ? embedUrlMatch[1] : '';

        // Clean up uploaded file
        fs.unlinkSync(videoFile.filepath);

        resolve(NextResponse.json({ embed_url: embedUrl }, { status: 200 }));
      } catch (error) {
        console.error('Vimeo Upload Error:', error.response?.data || error.message);
        resolve(NextResponse.json({ message: 'Vimeo upload failed.' }, { status: 500 }));
      }
    });

    busboy.on('error', (err) => {
      console.error('Busboy Error:', err);
      reject(err);
    });

    req.pipe(busboy);
  });
}
