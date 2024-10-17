# notifications/admin.py

from django.contrib import admin
from .models import Notification

@admin.register(Notification)
class NotificationAdmin(admin.ModelAdmin):
    list_display = ('recipient', 'notification_type', 'related_object_link', 'is_seen', 'created_at')
    search_fields = ('recipient__username', 'notification_type', 'message', 'related_object_id')
    list_filter = ('notification_type', 'is_seen', 'created_at')
    ordering = ('-created_at',)
    autocomplete_fields = ('recipient',)

    def related_object_link(self, obj):
        if obj.related_object:
            return f"{obj.related_object_type} ID: {obj.related_object_id}"
        return "-"
    related_object_link.short_description = 'Related Object'
