# accounts/urls.py

from django.urls import path
from .views import (
    GoogleLoginView, 
    CustomLoginView, 
    CustomLogoutView,
    UserDeviceView,
    CustomRegisterView,
    CustomUserDetailsView,
    AddDeviceView,
    MyUserIDView,
    CustomPasswordResetView,
    PasswordResetConfirmView
)
from dj_rest_auth.registration.views import VerifyEmailView
from dj_rest_auth.views import (
    PasswordChangeView
)

urlpatterns = [
    path('user-device/<int:uid>/', UserDeviceView.as_view(), name='user_device'),
    path('user-details/', CustomUserDetailsView.as_view(), name='user_details'),
    path('add-device/', AddDeviceView.as_view(), name='add-device'),
    path('my-userid/', MyUserIDView.as_view(), name='my-userid'),
    
    # Authentication URLs
    path('auth/google/', GoogleLoginView.as_view(), name='google_login'),
    path('login/', CustomLoginView.as_view(), name='custom_login'),
    path('logout/', CustomLogoutView.as_view(), name='custom_logout'),
    path('registration/', CustomRegisterView.as_view(), name='custom_register'), 
    path('registration/verify-email/', VerifyEmailView.as_view(), name='rest_verify_email'),
    
    # Password Reset URLs
    path('password/reset/', CustomPasswordResetView.as_view(), name='rest_password_reset'),
    path('password/reset/confirm/<uidb64>/<token>/', PasswordResetConfirmView.as_view(), name='password_reset_confirm'),
    path('password/change/', PasswordChangeView.as_view(), name='rest_password_change'),
]
