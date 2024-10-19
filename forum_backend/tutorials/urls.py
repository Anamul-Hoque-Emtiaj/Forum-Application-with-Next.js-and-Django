# tutorials/urls.py

from django.urls import path
from .views import VideoTutorialListCreateView

urlpatterns = [
    path('tutorials/', VideoTutorialListCreateView.as_view(), name='video_tutorials'),
]
