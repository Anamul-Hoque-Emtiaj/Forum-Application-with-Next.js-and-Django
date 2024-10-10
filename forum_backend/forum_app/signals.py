# forum_app/signals.py

from django.db.models.signals import post_save
from django.dispatch import receiver
from .models import Post, Comment
from .tasks import send_notification, send_verification_email
from django.contrib.auth import get_user_model

User = get_user_model()

@receiver(post_save, sender=Post)
def post_created(sender, instance, created, **kwargs):
    if created:
        # Notify users of new post
        user_ids = [user.id for user in User.objects.exclude(id=instance.author.id)]
        message = f'New post created: {instance.title}'
        send_notification.delay(user_ids, message)

@receiver(post_save, sender=Comment)
def comment_created(sender, instance, created, **kwargs):
    if created:
        # Notify post author or parent comment author
        if instance.parent:
            recipient_id = instance.parent.author.id
            message = f'{instance.author.email} replied to your comment.'
        else:
            recipient_id = instance.post.author.id
            message = f'{instance.author.email} commented on your post: {instance.post.title}'
        if instance.author.id != recipient_id:
            send_notification.delay([recipient_id], message)

@receiver(post_save, sender=User)
def user_created(sender, instance, created, **kwargs):
    if created and not instance.is_active:
        # Send verification email
        send_verification_email.delay(instance.id)
