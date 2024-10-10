# forum_app/serializers.py

from rest_framework import serializers
from django.contrib.auth import get_user_model
from .models import Post, Comment
from dj_rest_auth.registration.serializers import RegisterSerializer
from dj_rest_auth.serializers import LoginSerializer
from allauth.account.adapter import get_adapter

User = get_user_model()

# User Serializer
class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['id', 'email', 'is_verified']

# Custom Registration Serializer
class CustomRegisterSerializer(RegisterSerializer):
    username = None  # We are not using username field

    def get_cleaned_data(self):
        data = super().get_cleaned_data()
        return {
            'email': data.get('email', ''),
            'password1': data.get('password1', ''),
            'password2': data.get('password2', ''),
        }

    def save(self, request):
        user = super().save(request)
        user.is_active = False  # Deactivate account until email verification
        user.save()
        # Send verification email via Celery
        from .tasks import send_verification_email
        send_verification_email.delay(user.pk)
        return user

# Post Serializer
class PostSerializer(serializers.ModelSerializer):
    author = UserSerializer(read_only=True)
    comments_count = serializers.SerializerMethodField()

    class Meta:
        model = Post
        fields = ['id', 'title', 'description', 'date_posted', 'author', 'is_solved', 'comments_count']

    def get_comments_count(self, obj):
        return obj.comments.count()

# Comment Serializer
class CommentSerializer(serializers.ModelSerializer):
    author = UserSerializer(read_only=True)
    replies = serializers.SerializerMethodField()

    class Meta:
        model = Comment
        fields = ['id', 'content', 'date_posted', 'post', 'parent', 'author', 'replies']

    def get_replies(self, obj):
        if obj.replies.exists():
            return CommentSerializer(obj.replies.all(), many=True).data
        return []
