from django.db import models
from django.contrib.auth.models import AbstractUser

class CustomUser(AbstractUser):
    whatsapp_number = models.CharField(max_length=15, blank=True, null=True)
    fb_id_link = models.URLField(blank=True, null=True)
    medical_college = models.CharField(max_length=255, blank=True, null=True)
    session = models.CharField(max_length=50, blank=True, null=True)
    bmdc_reg_no = models.CharField(max_length=50, blank=True, null=True)
    profile_image = models.ImageField(upload_to='profile_pics/', blank=True, null=True)

    def __str__(self):
        return self.username

class Device(models.Model):
    user = models.ForeignKey(CustomUser, related_name='devices', on_delete=models.CASCADE)
    device_id = models.CharField(max_length=255)
    user_agent = models.CharField(max_length=255)
    ip_address = models.GenericIPAddressField()
    last_login = models.DateTimeField(auto_now=True)
    is_active = models.BooleanField(default=True)

    class Meta:
        # unique_together = ('user', 'device_id')
        indexes = [
            models.Index(fields=['user', 'is_active']),
            models.Index(fields=['device_id']),
        ]

    def __str__(self):
        return f"{self.user.username} - {self.device_id}"
