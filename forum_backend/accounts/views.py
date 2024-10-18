from dj_rest_auth.registration.views import SocialLoginView
from allauth.socialaccount.providers.google.views import GoogleOAuth2Adapter
from rest_framework import generics, permissions, status
from rest_framework.permissions import IsAuthenticated
from .models import Device, CustomUser
from .serializers import CustomLoginSerializer, CustomLogoutSerializer,UserDeviceSerializer,CustomRegisterSerializer,UserSerializer,AddDeviceSerializer
from rest_framework.response import Response
from dj_rest_auth.views import LogoutView,LoginView,UserDetailsView
from dj_rest_auth.registration.views import RegisterView
from django.utils.timezone import now
from dj_rest_auth.views import PasswordResetView as DjRestAuthPasswordResetView
from .serializers import CustomPasswordResetSerializer
from dj_rest_auth.serializers import PasswordResetConfirmSerializer

# Create your views here.
class PasswordResetConfirmView(generics.GenericAPIView):
    """
    Password reset e-mail link is confirmed, therefore
    this resets the user's password.

    Accepts the following POST parameters: new_password1, new_password2
    """
    serializer_class = PasswordResetConfirmSerializer
    permission_classes = [permissions.AllowAny]

    def post(self, request, uidb64, token, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        serializer.save()
        return Response({'detail': 'Password has been reset with the new password.'}, status=status.HTTP_200_OK)
class CustomPasswordResetView(DjRestAuthPasswordResetView):
    serializer_class = CustomPasswordResetSerializer

    def post(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        serializer.save()
        return Response({"detail": "Password reset email has been sent."}, status=status.HTTP_200_OK)
class GoogleLoginView(SocialLoginView):
    adapter_class = GoogleOAuth2Adapter

class CustomLoginView(LoginView):
    serializer_class = CustomLoginSerializer

class CustomLogoutView(LogoutView):
    serializer_class = CustomLogoutSerializer
    permission_classes = [permissions.IsAuthenticated]

    def post(self, request, *args, **kwargs):
        device_id = request.data.get('device_id', None)
        print(device_id)
        if device_id is not None:
            device = Device.objects.filter(device_id=device_id, user=request.user, is_active=True)
            if device is not None:
                Device.objects.filter(user=request.user).update(is_active=False)
                
        return self.logout(request)

class CustomRegisterView(RegisterView):
    serializer_class = CustomRegisterSerializer

class AddDeviceView(generics.GenericAPIView):
    serializer_class = AddDeviceSerializer
    permission_classes = [IsAuthenticated]

    def post(self, request, *args, **kwargs):
        device_id = request.data.get('device_id', None)
        user_agent = request.META.get('HTTP_USER_AGENT', '')
        ip_address = self.get_client_ip(request)
        try:
            device = Device.objects.get(user=request.user, device_id=device_id)
            device.is_active = True
            device.last_active = now()
            device.save()
            return Response({'message': 'Device updated successfully!'}, status=status.HTTP_200_OK)
        except Device.DoesNotExist:
            Device.objects.create(
                user=request.user,
                device_id=device_id,
                user_agent=user_agent,
                ip_address=ip_address,
                is_active=True,
                last_login=now()
            )
            return Response({'message': 'Device added successfully!'}, status=status.HTTP_201_CREATED)

    def get_client_ip(self, request):
        x_forwarded_for = request.META.get('HTTP_X_FORWARDED_FOR')
        if x_forwarded_for:
            ip = x_forwarded_for.split(',')[0]
        else:
            ip = request.META.get('REMOTE_ADDR')
        return ip

class MyUserIDView(generics.GenericAPIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        return Response({'uid': request.user.id}, status=status.HTTP_200_OK)

class CustomUserDetailsView(UserDetailsView):
    serializer_class = UserSerializer
    
class UserDeviceView(generics.ListAPIView):
    serializer_class = UserDeviceSerializer
    permission_classes = [IsAuthenticated]

    def get(self, request, uid):
        if request.user.id == uid or request.user.is_stuff:
            user = CustomUser.objects.get(pk=uid)
            devices = Device.objects.filter(user=user)
            serializer = UserDeviceSerializer(devices, many=True)
            return Response(serializer.data, status=status.HTTP_200_OK)
        else:
            message = 'You are not allowed for this request!'
            return Response({'message': message}, status=status.HTTP_403_FORBIDDEN)