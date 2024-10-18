from rest_framework import serializers
from .models import Post, Comment
import bleach
from bleach import Cleaner
from bleach.css_sanitizer import CSSSanitizer

class PostListSerializer(serializers.ModelSerializer):
    author_username = serializers.CharField(source='author.username', read_only=True)

    class Meta:
        model = Post
        fields = ['id', 'author_username', 'title', 'created_at', 'is_resolved']


class PostCreateSerializer(serializers.ModelSerializer):
    class Meta:
        model = Post
        fields = ['title', 'description']

    def validate_description(self, value):
        allowed_tags = bleach.sanitizer.ALLOWED_TAGS.union({
            'img', 'p', 'br', 'strong', 'em', 'u', 'ul', 'ol',
            'li', 'span', 'h1', 'h2', 'h3', 'blockquote', 'pre', 'code'
        })

        allowed_attributes = {
            '*': ['style', 'class'],
            'a': ['href', 'title', 'target', 'rel'],
            'img': ['src', 'alt', 'title', 'width', 'height', 'style'],
        }

        allowed_css_properties = [
            'color',
            'background-color',
            'width',
            'height',
            'text-align',
        ]

        css_sanitizer = CSSSanitizer(
            allowed_css_properties=allowed_css_properties,
        )

        cleaner = Cleaner(
            tags=allowed_tags,
            attributes=allowed_attributes,
            css_sanitizer=css_sanitizer,
            strip=True,
        )

        cleaned_value = cleaner.clean(value)
        return cleaned_value
    
class CommentSerializer(serializers.ModelSerializer):
    author_username = serializers.CharField(source='author.username', read_only=True)
    replies = serializers.SerializerMethodField()

    class Meta:
        model = Comment
        fields = ['id', 'parent', 'author_username', 'content', 'created_at', 'replies']

    def get_replies(self, obj):
        replies = obj.replies.filter(parent=None)
        serializer = CommentSerializer(replies, many=True)
        return serializer.data



class PostDetailSerializer(serializers.ModelSerializer):
    author_username = serializers.CharField(source='author.username', read_only=True)
    comments = CommentSerializer(many=True, read_only=True)

    class Meta:
        model = Post
        fields = [
            'id', 'author_username', 'title', 'description',
            'created_at', 'is_resolved', 'comments'
        ]

    def validate_description(self, value):
        allowed_tags = bleach.sanitizer.ALLOWED_TAGS.union({
            'img', 'p', 'br', 'strong', 'em', 'u', 'ul', 'ol',
            'li', 'span', 'h1', 'h2', 'h3', 'blockquote', 'pre', 'code'
        })

        allowed_attributes = {
            '*': ['style', 'class'],
            'a': ['href', 'title', 'target', 'rel'],
            'img': ['src', 'alt', 'title', 'width', 'height', 'style'],
        }

        allowed_css_properties = [
            'color',
            'background-color',
            'width',
            'height',
            'text-align',
        ]

        css_sanitizer = CSSSanitizer(
            allowed_css_properties=allowed_css_properties,
        )

        cleaner = Cleaner(
            tags=allowed_tags,
            attributes=allowed_attributes,
            css_sanitizer=css_sanitizer,
            strip=True,
        )

        cleaned_value = cleaner.clean(value)
        return cleaned_value

class CommentCreateSerializer(serializers.ModelSerializer): 
    class Meta:
        model = Comment
        fields = ['content']
