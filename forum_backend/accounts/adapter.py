from allauth.account.adapter import DefaultAccountAdapter
from django.conf import settings
from django.contrib.auth.tokens import default_token_generator
from django.utils.http import urlsafe_base64_encode
from django.utils.encoding import force_bytes
from .tasks import send_email_confirmation, send_password_reset_email

class CustomAccountAdapter(DefaultAccountAdapter):
    def get_email_confirmation_url(self, request, emailconfirmation):
        return f"{settings.FRONTEND_URL}/auth/confirm-email?key={emailconfirmation.key}"

    def get_password_reset_url(self, request, user, token):
        # Encode the user's primary key (uid)
        uid = urlsafe_base64_encode(force_bytes(user.pk))
        # Construct the frontend URL with uid and token as query parameters
        return f"{settings.FRONTEND_URL}/auth/password-reset?uid={uid}&token={token}"
    
    # def send_confirmation_mail(self, request, emailconfirmation, signup):
    #     user_email = emailconfirmation.email_address.email
    #     confirmation_url = self.get_email_confirmation_url(request, emailconfirmation)
    #     send_email_confirmation.delay(user_email, confirmation_url)

    # def send_password_reset_email(self, request, email, **kwargs):
    #     reset_url = self.get_password_reset_url(request, email)
    #     send_password_reset_email.delay(email, reset_url)
