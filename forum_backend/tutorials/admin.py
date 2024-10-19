# tutorials/admin.py

from django.contrib import admin
from .models import VideoTutorial

@admin.register(VideoTutorial)
class VideoTutorialAdmin(admin.ModelAdmin):
    list_display = ('title', 'uploader', 'storage_provider', 'visibility', 'created_at')
    list_filter = ('storage_provider', 'visibility', 'created_at')
    search_fields = ('title', 'description', 'uploader__username')
