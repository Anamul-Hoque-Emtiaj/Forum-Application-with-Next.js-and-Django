# forum_app/views.py

from rest_framework import generics, status, permissions
from rest_framework.views import APIView
from rest_framework.response import Response
from .models import Post, Comment
from .serializers import (
    UserSerializer,
    PostSerializer,
    CommentSerializer,
)
from rest_framework.parsers import MultiPartParser, FormParser
from django.core.files.storage import default_storage
from django.core.files.base import ContentFile
from django.conf import settings
from django.contrib.auth import get_user_model
from django.utils.http import urlsafe_base64_decode
from django.utils.encoding import force_str
from allauth.account.utils import complete_signup
from allauth.account import app_settings as allauth_settings
from dj_rest_auth.registration.views import VerifyEmailView
from dj_rest_auth.views import PasswordResetConfirmView
from dj_rest_auth.registration.views import SocialLoginView
from allauth.socialaccount.providers.google.views import GoogleOAuth2Adapter
import uuid
import os
from PIL import Image
from .tasks import send_notification

User = get_user_model()

# Google OAuth Login View
class GoogleLogin(SocialLoginView):
    adapter_class = GoogleOAuth2Adapter

# Email Verification View
class CustomVerifyEmailView(VerifyEmailView):
    def post(self, request, *args, **kwargs):
        response = super().post(request, *args, **kwargs)
        # Custom behavior after email verification
        return response

# Password Reset Confirm View
class CustomPasswordResetConfirmView(PasswordResetConfirmView):
    def post(self, request, *args, **kwargs):
        response = super().post(request, *args, **kwargs)
        # Custom behavior after password reset
        return response

# User Profile View
class UserProfileView(generics.RetrieveAPIView):
    permission_classes = [permissions.IsAuthenticated]
    serializer_class = UserSerializer

    def get_object(self):
        return self.request.user

# Post Views
class PostListCreateView(generics.ListCreateAPIView):
    queryset = Post.objects.all().order_by('-date_posted')
    serializer_class = PostSerializer
    permission_classes = [permissions.IsAuthenticatedOrReadOnly]

    def perform_create(self, serializer):
        post = serializer.save(author=self.request.user)
        # Send notification via Celery
        user_ids = [user.id for user in User.objects.exclude(id=self.request.user.id)]
        message = f'New post created: {post.title}'
        send_notification.delay(user_ids, message)

class PostDetailView(generics.RetrieveAPIView):
    queryset = Post.objects.all()
    serializer_class = PostSerializer
    permission_classes = [permissions.AllowAny]

# Comment Views
class CommentListCreateView(generics.ListCreateAPIView):
    serializer_class = CommentSerializer
    permission_classes = [permissions.IsAuthenticatedOrReadOnly]

    def get_queryset(self):
        post_id = self.kwargs.get('post_id')
        return Comment.objects.filter(post_id=post_id, parent=None).order_by('-date_posted')

    def perform_create(self, serializer):
        post_id = self.kwargs.get('post_id')
        comment = serializer.save(author=self.request.user, post_id=post_id)
        # Send notification to post author via Celery
        post = comment.post
        if self.request.user != post.author:
            user_ids = [post.author.id]
            message = f'{self.request.user.email} commented on your post: {post.title}'
            send_notification.delay(user_ids, message)

class ReplyCreateView(generics.CreateAPIView):
    serializer_class = CommentSerializer
    permission_classes = [permissions.IsAuthenticated]

    def perform_create(self, serializer):
        parent_id = self.request.data.get('parent')
        post_id = self.request.data.get('post')
        reply = serializer.save(author=self.request.user, parent_id=parent_id, post_id=post_id)
        # Send notification to comment author via Celery
        parent_comment = reply.parent
        if self.request.user != parent_comment.author:
            user_ids = [parent_comment.author.id]
            message = f'{self.request.user.email} replied to your comment.'
            send_notification.delay(user_ids, message)

# Image Upload View
class ImageUploadView(APIView):
    parser_classes = [MultiPartParser, FormParser]
    permission_classes = [permissions.IsAuthenticated]

    def post(self, request, format=None):
        image = request.FILES.get('image')
        if not image:
            return Response({'error': 'No image provided'}, status=status.HTTP_400_BAD_REQUEST)

        # Validate image size (max 5 MB)
        MAX_UPLOAD_SIZE = 5 * 1024 * 1024  # 5 MB
        if image.size > MAX_UPLOAD_SIZE:
            return Response({'error': 'Image file too large (max 5MB)'}, status=status.HTTP_400_BAD_REQUEST)

        # Validate image content
        try:
            img = Image.open(image)
            img.verify()
            image.seek(0)
        except Exception:
            return Response({'error': 'Invalid image content'}, status=status.HTTP_400_BAD_REQUEST)

        # Generate a unique filename
        extension = os.path.splitext(image.name)[1]
        image_name = f'images/{uuid.uuid4().hex}{extension}'
        image_path = default_storage.save(image_name, ContentFile(image.read()))
        image_url = default_storage.url(image_path)
        full_image_url = request.build_absolute_uri(image_url)
        return Response({'url': full_image_url}, status=status.HTTP_201_CREATED)
