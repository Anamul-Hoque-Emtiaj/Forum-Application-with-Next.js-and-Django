from rest_framework import generics, permissions, status
from rest_framework.response import Response
from .models import Post, Comment
from .serializers import PostListSerializer, CommentSerializer, PostDetailSerializer,PostCreateSerializer,CommentCreateSerializer
from tasks.tasks import send_new_post_notification, send_new_comment_notification
from django.shortcuts import get_object_or_404
from PIL import Image
from django.core.files.storage import default_storage
from django.conf import settings
import os
import uuid
from rest_framework.parsers import MultiPartParser, FormParser
from rest_framework.views import APIView

class PostListView(generics.ListAPIView):
    queryset = Post.objects.all()
    serializer_class = PostListSerializer
    permission_classes = [permissions.AllowAny]


class PostDetailView(generics.RetrieveAPIView):
    serializer_class = PostDetailSerializer
    permission_classes = [permissions.AllowAny]
    queryset = Post.objects.all()


class PostCreateView(generics.CreateAPIView):
    serializer_class = PostCreateSerializer
    permission_classes = [permissions.IsAuthenticated]

    def perform_create(self, serializer):
        post = serializer.save(author=self.request.user)
        # Call the task to send new post notifications
        send_new_post_notification.delay(post.id, post.title)


class PostCommentView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def post(self, request, pk):
        post = get_object_or_404(Post, pk=pk)
        serializer = CommentCreateSerializer(data=request.data)
        if serializer.is_valid():
            comment = serializer.save(author=request.user, post=post)
            # Call the task to send new comment notification to the post owner
            if post.author.id != request.user.id:
                send_new_comment_notification.delay(
                    post_owner_id=post.author.id,
                    post_id=post.id,
                    comment_text=comment.content
                )
            return Response(
                CommentSerializer(comment).data,
                status=status.HTTP_201_CREATED
            )
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class CommentReplyView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def post(self, request, pk):
        parent_comment = get_object_or_404(Comment, pk=pk)
        serializer = CommentCreateSerializer(data=request.data)
        if serializer.is_valid():
            comment = serializer.save(
                author=request.user,
                post=parent_comment.post,
                parent=parent_comment
            )
            # Notify the parent comment author if they are not the same as the requester
            if parent_comment.author.id != request.user.id:
                send_new_comment_notification.delay(
                    post_owner_id=parent_comment.author.id,
                    post_id=parent_comment.post.id,
                    comment_text=comment.content
                )
            return Response(
                CommentSerializer(comment).data,
                status=status.HTTP_201_CREATED
            )
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class PostResolveView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def post(self, request, pk):
        post = get_object_or_404(Post, pk=pk)
        if post.author != request.user:
            return Response(
                {'detail': 'You do not have permission to resolve this post.'},
                status=status.HTTP_403_FORBIDDEN
            )
        post.is_resolved = True
        post.save()
        # Optionally, you can send a notification about the post being resolved
        return Response({'status': 'Post marked as resolved'})


MAX_FILE_SIZE = 5 * 1024 * 1024  # 5 MB    
class ImageUploadView(APIView):
    parser_classes = [MultiPartParser, FormParser]
    permission_classes = [permissions.IsAuthenticated]

    def post(self, request, format=None):
        image = request.FILES.get('image')
        if image:
            if image.size > MAX_FILE_SIZE:
                return Response({'error': 'Image file too large (max 5 MB)'}, status=status.HTTP_400_BAD_REQUEST)
            try:
                # Validate the image
                img = Image.open(image)
                img.verify()
            except Exception:
                return Response({'error': 'Invalid image file'}, status=status.HTTP_400_BAD_REQUEST)
            # Generate a unique filename
            filename = f"{uuid.uuid4().hex}_{image.name}"
            filepath = os.path.join(settings.MEDIA_ROOT, 'uploads', filename)

            # Save the file
            with default_storage.open(filepath, 'wb+') as destination:
                for chunk in image.chunks():
                    destination.write(chunk)

            # Build the URL to return
            url = request.build_absolute_uri(f"{settings.MEDIA_URL}uploads/{filename}")

            return Response({'url': url}, status=status.HTTP_201_CREATED)
        else:
            return Response({'error': 'No image provided'}, status=status.HTTP_400_BAD_REQUEST)
