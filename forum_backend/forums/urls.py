from django.urls import path, include
from .views import PostListView,PostDetailView,PostCreateView,PostCommentView,CommentReplyView,PostResolveView,ImageUploadView
urlpatterns = [
    path('posts/', PostListView.as_view(), name='post_list'),
    path('posts/<int:pk>/', PostDetailView.as_view(), name='post_detail'),
    path('posts/create/', PostCreateView.as_view(), name='post_create'),
    path('posts/<int:pk>/add-comment/',PostCommentView.as_view(),name='post_comment'),
    path('comments/<int:pk>/add-reply/',CommentReplyView.as_view(),name='comment_reply'),
    path('posts/<int:pk>/resolved/',PostResolveView.as_view(),name='post_resolve'),
    path('posts/upload/', ImageUploadView.as_view(), name='image_upload'),
]