# accounts/tasks.py

from celery import shared_task
from django.core.mail import send_mail
from django.conf import settings
from django.template.loader import render_to_string

@shared_task
def send_email_confirmation(user_email, confirmation_url):
    subject = 'Confirm Your Email'
    message = render_to_string('emails/email_confirmation.txt', {
        'confirmation_url': confirmation_url,
    })
    send_mail(
        subject,
        message,
        settings.DEFAULT_FROM_EMAIL,
        [user_email],
        fail_silently=False,
    )

@shared_task
def send_password_reset_email(user_email, reset_url):
    subject = 'Reset Your Password'
    message = render_to_string('emails/password_reset.txt', {
        'reset_url': reset_url,
    })
    send_mail(
        subject,
        message,
        settings.DEFAULT_FROM_EMAIL,
        [user_email],
        fail_silently=False,
    )
