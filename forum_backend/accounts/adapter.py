from allauth.account.adapter import DefaultAccountAdapter
from django.conf import settings
from django.utils.http import urlsafe_base64_encode
from django.utils.encoding import force_bytes
from .tasks import send_email_confirmation, send_password_reset_email

class CustomAccountAdapter(DefaultAccountAdapter):
    def get_email_confirmation_url(self, request, emailconfirmation):
        """
        Constructs the email confirmation URL pointing to the frontend.
        """
        return f"{settings.FRONTEND_URL}/auth/confirm-email?key={emailconfirmation.key}"
    
    def send_confirmation_mail(self, request, emailconfirmation, signup):
        """
        Sends the email confirmation using a Celery task.
        """
        user_email = emailconfirmation.email_address.email
        confirmation_url = self.get_email_confirmation_url(request, emailconfirmation)
        send_email_confirmation.delay(user_email, confirmation_url)

