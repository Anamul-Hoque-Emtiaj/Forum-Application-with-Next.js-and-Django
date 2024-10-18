from django.urls import path, include
from .views import NotificationListView, NotificationSeenView
urlpatterns = [
    path('notifications/', NotificationListView.as_view(), name='notification_list'),
    path('notifications/<int:pk>/seen/', NotificationSeenView.as_view(), name='notification_seen'),

]