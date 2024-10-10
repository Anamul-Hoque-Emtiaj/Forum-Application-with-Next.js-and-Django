# forum_app/tasks.py

from celery import shared_task
from django.core.mail import send_mail
from django.conf import settings
from .models import User
from asgiref.sync import async_to_sync
from channels.layers import get_channel_layer
from django.template.loader import render_to_string
from django.contrib.sites.models import Site
from django.urls import reverse
from allauth.account.utils import user_pk_to_url_str, user_email
from allauth.account.models import EmailConfirmationHMAC
from django.utils.http import urlsafe_base64_encode
from django.utils.encoding import force_bytes
import uuid

@shared_task
def send_verification_email(user_id):
    user = User.objects.get(pk=user_id)
    current_site = Site.objects.get_current()
    email_context = {
        'user': user,
        'protocol': 'http',
        'domain': current_site.domain,
        'site_name': current_site.name,
        'key': EmailConfirmationHMAC(user).key,
    }
    subject = render_to_string('account/email/email_confirmation_subject.txt', email_context)
    subject = ''.join(subject.splitlines())
    message = render_to_string('account/email/email_confirmation_message.txt', email_context)
    send_mail(
        subject,
        message,
        settings.DEFAULT_FROM_EMAIL,
        [user_email(user)],
        fail_silently=False,
    )

@shared_task
def send_password_reset_email(user_id):
    user = User.objects.get(pk=user_id)
    current_site = Site.objects.get_current()
    uid = urlsafe_base64_encode(force_bytes(user.pk))
    token = user.tokens['password_reset']
    reset_url = f"{settings.FRONTEND_URL}/auth/reset-password/?uid={uid}&token={token}"
    email_context = {
        'user': user,
        'protocol': 'http',
        'domain': current_site.domain,
        'site_name': current_site.name,
        'uid': uid,
        'token': token,
        'reset_url': reset_url,
    }
    subject = render_to_string('account/email/password_reset_subject.txt', email_context)
    subject = ''.join(subject.splitlines())
    message = render_to_string('account/email/password_reset_message.txt', email_context)
    send_mail(
        subject,
        message,
        settings.DEFAULT_FROM_EMAIL,
        [user_email(user)],
        fail_silently=False,
    )

@shared_task
def send_notification(user_ids, message):
    channel_layer = get_channel_layer()
    for user_id in user_ids:
        group_name = f'user_{user_id}'
        async_to_sync(channel_layer.group_send)(
            group_name,
            {
                'type': 'send_notification',
                'message': message,
            }
        )
