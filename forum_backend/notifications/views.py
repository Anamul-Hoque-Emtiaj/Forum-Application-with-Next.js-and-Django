from rest_framework import generics, permissions, status
from rest_framework.response import Response
from .models import Notification
from .serializers import NotificationSerializer
from rest_framework.pagination import PageNumberPagination
from django.shortcuts import get_object_or_404

class NotificationPagination(PageNumberPagination):
    page_size = 20

class NotificationListView(generics.ListAPIView):
    serializer_class = NotificationSerializer
    permission_classes = [permissions.IsAuthenticated]
    pagination_class = NotificationPagination

    def get_queryset(self):
        return Notification.objects.filter(recipient=self.request.user).order_by('-created_at')

class NotificationSeenView(generics.UpdateAPIView):
    serializer_class = NotificationSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_object(self):
        return get_object_or_404(Notification, pk=self.kwargs['pk'], recipient=self.request.user)

    def update(self, request, *args, **kwargs):
        notification = self.get_object()
        notification.is_seen = True
        notification.save()
        return Response({'status': 'Notification marked as seen.'})
