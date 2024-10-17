# accounts/serializers.py
from dj_rest_auth.registration.serializers import RegisterSerializer
from dj_rest_auth.serializers import LoginSerializer,UserDetailsSerializer
from rest_framework import serializers
from .models import Device,CustomUser
from django.utils.timezone import now

class CustomLoginSerializer(LoginSerializer):
    username = None  # Remove the username field
    device_id = serializers.CharField(required=False)
    def validate(self, attrs):
        # Extract device information
        device_id = attrs.pop('device_id', None)
        # Perform default validation
        attrs = super().validate(attrs)
        if device_id is None:
            return attrs
        user = CustomUser.objects.get(email=attrs['email'])

        # Get request from context
        request = self.context.get('request')
        user_agent = request.META.get('HTTP_USER_AGENT', '')
        ip_address = self.get_client_ip(request)

        # Check active devices
        active_devices = Device.objects.filter(user=user, is_active=True)

        if active_devices.count() >= 2:
            # Option 1: Deny login
            raise serializers.ValidationError("Maximum number of active devices reached. Please logout from another device.")

            # Option 2: Remove the oldest device and allow login
            # oldest_device = active_devices.order_by('created_at').first()
            # oldest_device.is_active = False
            # oldest_device.save()

        # Create or update the device
        if Device.objects.filter(user=user,device_id=device_id).exists():
            Device.objects.filter(user=user,device_id=device_id).update(
                user_agent=user_agent,
                ip_address=ip_address,
                last_login=now(),
                is_active=True
            )
        else:
            device = Device.objects.create(
                user=user,
                device_id=device_id,
                user_agent=user_agent,
                ip_address=ip_address,
                last_login=now(),
                is_active=True
            )

        return attrs

    def get_client_ip(self, request):
        x_forwarded_for = request.META.get('HTTP_X_FORWARDED_FOR')
        if x_forwarded_for:
            ip = x_forwarded_for.split(',')[0]
        else:
            ip = request.META.get('REMOTE_ADDR')
        return ip

class CustomLogoutSerializer(serializers.Serializer):
    device_id = serializers.CharField(required=False)

class AddDeviceSerializer(serializers.Serializer):
    device_id = serializers.CharField(required=True)

class CustomRegisterSerializer(RegisterSerializer):
    email = serializers.EmailField(required=True)
    first_name = serializers.CharField(required=True)
    last_name = serializers.CharField(required=True)

    def get_cleaned_data(self):
        data = super().get_cleaned_data()
        data['first_name'] = self.validated_data.get('first_name', '')
        data['last_name'] = self.validated_data.get('last_name', '')
        data['email'] = self.validated_data.get('email', '')
        return data

    def save(self, request):
        user = super().save(request)
        user.first_name = self.validated_data.get('first_name', '')
        user.last_name = self.validated_data.get('last_name', '')
        user.save()
        return user

class UserSerializer(UserDetailsSerializer):
    class Meta:
        model = CustomUser
        fields = UserDetailsSerializer.Meta.fields + ('whatsapp_number', 'fb_id_link', 'medical_college', 'session', 'bmdc_reg_no', 'profile_image')


class UserDeviceSerializer(serializers.ModelSerializer):
    class Meta:
        model = Device
        fields = ['user_agent', 'ip_address', 'last_login', 'is_active']