from celery import shared_task
from notifications.models import Notification
from forums.models import Post
from asgiref.sync import async_to_sync
from channels.layers import get_channel_layer
from django.contrib.auth import get_user_model

User = get_user_model()


@shared_task
def send_new_post_notification(post_id, post_title):
    users = User.objects.all()
    notifications = []
    channel_layer = get_channel_layer()
    post = Post.objects.get(id=post_id)
    for user in users:
        notification = Notification(
            recipient=user,
            notification_type='new_post',
            message=f"A new post '{post_title}' has been added.",
            post=post
        )
        notifications.append(notification)
    Notification.objects.bulk_create(notifications)

    # Send real-time notifications
    for notification in notifications:
        async_to_sync(channel_layer.group_send)(
            f'user_{notification.recipient.id}',
            {
                'type': 'send_notification',
                'message': notification.message,
                'id': notification.post.id,
                'time': notification.created_at.strftime('%b %d, %Y %I:%M %p'),
            }
        )

@shared_task
def send_new_comment_notification(post_owner_id, post_id, comment_text):
    try:
        user = User.objects.get(id=post_owner_id)
    except User.DoesNotExist:
        return

    post = Post.objects.get(id=post_id)
    notification = Notification.objects.create(
        recipient=user,
        notification_type='comment',
        message=f"Someone commented on your post: {comment_text[:50]}...",
        post=post
    )

    # Send real-time notification
    channel_layer = get_channel_layer()
    async_to_sync(channel_layer.group_send)(
        f'user_{user.id}',
        {
            'type': 'send_notification',
            'message': notification.message,
            'id': notification.post.id,
            'time': notification.created_at.strftime('%b %d, %Y %I:%M %p'),
        }
    )
