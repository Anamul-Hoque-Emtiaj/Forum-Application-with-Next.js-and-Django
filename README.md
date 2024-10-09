# Forum-Application-with-Next.js-and-Django

## Project's Description

This repository contains a full-stack forum application built with Next.js for the frontend and Django REST Framework for the backend. The application features:

- **Dual Authentication System**: Supports manual signup with email verification and one-click sign-in/up with Google OAuth.
- **Password Reset Functionality**: Allows users who signed up manually to reset their password via email.
- **User Profile Page**: Each user has a dedicated page displaying their information and forum activity.
- **Forum Pages**:
  - **Forum List Page**: Displays a paginated list of forum posts. Includes a modal to add new forum posts.
  - **Forum Post Details Page**: Shows the post title, rich-text description (supports images, tables, etc.), issue status, and a nested comment section with replies.
- **Notification System**:
  - Sends notifications to all users when a new post is created.
  - Notifies users when someone comments on their post.
  - Alerts users when someone replies to their comment.
  - Implemented using WebSockets for real-time updates.
- **Background Task Processing**:
  - Utilizes Celery for handling notifications and email sending in the background.
- **Technologies Used**:
  - **Frontend**: Next.js, React, Axios, React-Quill (for rich-text editing).
  - **Backend**: Django, Django REST Framework, Django Channels (for WebSockets), Celery, Redis (as a message broker).
  - **Authentication**: Django AllAuth, dj-rest-auth, NextAuth.js.