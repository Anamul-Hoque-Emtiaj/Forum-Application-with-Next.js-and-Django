from celery import shared_task
from django.core.mail import send_mail
from django.contrib.auth.models import User

@shared_task
def send_new_post_notification(post_id):
    # Fetch post and send notification to all users
    # Implement your email sending logic here
    pass

@shared_task
def send_comment_notification(comment_id):
    # Fetch comment and send notification to the post author
    # Implement your email sending logic here
    pass
