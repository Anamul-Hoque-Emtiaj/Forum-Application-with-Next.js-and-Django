from django.db import models
from accounts.models import CustomUser
from forums.models import Post

class Notification(models.Model):
    NOTIFICATION_TYPES = [
        ('new_post', 'New Forum Post'),
        ('comment', 'New Comment'),
    ]
    recipient = models.ForeignKey(CustomUser, related_name='notifications', on_delete=models.CASCADE)
    notification_type = models.CharField(max_length=20, choices=NOTIFICATION_TYPES)
    post = models.ForeignKey(Post, null=True, blank=True, on_delete=models.CASCADE)
    message = models.TextField()
    is_seen = models.BooleanField(default=False)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        indexes = [
            models.Index(fields=['recipient', 'is_seen']),
        ]
        ordering = ['-created_at']

    def __str__(self):
        return f"Notification to {self.recipient.username} - {self.notification_type}"
