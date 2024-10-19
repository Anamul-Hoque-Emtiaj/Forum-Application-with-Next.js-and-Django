# tutorials/models.py

from django.db import models
from accounts.models import CustomUser

class VideoTutorial(models.Model):
    VISIBILITY_CHOICES = [
        ('public', 'Public'),
        ('private', 'Private'),
        ('unlisted', 'Unlisted'),
    ]
    
    STORAGE_PROVIDER_CHOICES = [
        ('youtube', 'YouTube'),
        ('vimeo', 'Vimeo'),
    ]
    
    title = models.CharField(max_length=255)
    description = models.TextField(blank=True)
    visibility = models.CharField(max_length=10, choices=VISIBILITY_CHOICES, default='public')
    storage_provider = models.CharField(max_length=10, choices=STORAGE_PROVIDER_CHOICES)
    embed_url = models.URLField()
    uploader = models.ForeignKey(CustomUser, on_delete=models.CASCADE, related_name='uploaded_videos')
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    def __str__(self):
        return self.title
    
    class Meta:
        ordering = ['-created_at']
