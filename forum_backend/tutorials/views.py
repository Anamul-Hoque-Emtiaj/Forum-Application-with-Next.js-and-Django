# tutorials/views.py

from rest_framework import generics, permissions
from .models import VideoTutorial
from .serializers import VideoTutorialSerializer

class VideoTutorialListCreateView(generics.ListCreateAPIView):
    serializer_class = VideoTutorialSerializer
    permission_classes = [permissions.IsAuthenticated]
    queryset = VideoTutorial.objects.all()
