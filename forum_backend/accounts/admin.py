# accounts/admin.py

from django.contrib import admin
from django.contrib.auth.admin import UserAdmin as BaseUserAdmin
from django.contrib.auth import get_user_model
from .models import Device

CustomUser = get_user_model()

# Define an inline admin descriptor for Device model
class DeviceInline(admin.TabularInline):
    model = Device
    extra = 1
    readonly_fields = ('last_login',)
    can_delete = True

# Define a new User admin
@admin.register(CustomUser)
class CustomUserAdmin(BaseUserAdmin):
    inlines = (DeviceInline,)
    list_display = ('username', 'email', 'first_name', 'last_name', 'is_staff', 'is_active')
    search_fields = ('username', 'email', 'first_name', 'last_name')
    list_filter = ('is_staff', 'is_active', 'groups')

    fieldsets = (
        (None, {'fields': ('username', 'password')}),
        ('Personal info', {'fields': ('first_name', 'last_name', 'email', 'whatsapp_number', 'fb_id_link', 'medical_college', 'session', 'bmdc_reg_no', 'profile_image')}),
        ('Permissions', {'fields': ('is_active', 'is_staff', 'is_superuser', 'groups', 'user_permissions')}),
        ('Important dates', {'fields': ('last_login', 'date_joined')}),
    )

    add_fieldsets = (
        (None, {
            'classes': ('wide',),
            'fields': ('username', 'email', 'password1', 'password2'),
        }),
    )

# Register Device model separately if you want to manage devices independently
@admin.register(Device)
class DeviceAdmin(admin.ModelAdmin):
    list_display = ('user', 'device_id', 'ip_address', 'user_agent', 'is_active', 'last_login')
    search_fields = ('user__username', 'device_id', 'ip_address', 'user_agent')
    list_filter = ('is_active', 'user')
    ordering = ('-last_login',)
