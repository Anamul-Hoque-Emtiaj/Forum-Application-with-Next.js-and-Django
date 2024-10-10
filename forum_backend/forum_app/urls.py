# forum_app/urls.py

from django.urls import path, include
from .views import (
    UserProfileView,
    PostListCreateView,
    PostDetailView,
    CommentListCreateView,
    ReplyCreateView,
    ImageUploadView,
    GoogleLogin,
    CustomVerifyEmailView,
    CustomPasswordResetConfirmView,
)
from dj_rest_auth.views import PasswordResetView
from dj_rest_auth.registration.views import VerifyEmailView

urlpatterns = [
    # User Profile
    path('auth/user/', UserProfileView.as_view(), name='user_profile'),
    
    # Posts
    path('posts/', PostListCreateView.as_view(), name='post_list_create'),
    path('posts/<int:pk>/', PostDetailView.as_view(), name='post_detail'),

    # Comments
    path('posts/<int:post_id>/comments/', CommentListCreateView.as_view(), name='comment_list_create'),
    path('comments/', ReplyCreateView.as_view(), name='reply_create'),

    # Image Upload
    path('upload/', ImageUploadView.as_view(), name='image_upload'),

    # Authentication
    path('dj-rest-auth/', include('dj_rest_auth.urls')),
    path('dj-rest-auth/registration/', include('dj_rest_auth.registration.urls')),

    # Email Verification Override
    path('dj-rest-auth/registration/verify-email/', CustomVerifyEmailView.as_view(), name='rest_verify_email'),

    # Password Reset Confirm Override
    path('dj-rest-auth/password/reset/confirm/', CustomPasswordResetConfirmView.as_view(), name='password_reset_confirm'),

    # Google OAuth
    path('dj-rest-auth/google/', GoogleLogin.as_view(), name='google_login'),
]
