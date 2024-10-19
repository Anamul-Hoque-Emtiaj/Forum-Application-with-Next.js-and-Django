# tutorials/serializers.py

from rest_framework import serializers
from .models import VideoTutorial

class VideoTutorialSerializer(serializers.ModelSerializer):
    class Meta:
        model = VideoTutorial
        fields = ['id', 'title', 'description', 'visibility', 'storage_provider', 'embed_url', 'uploader', 'created_at', 'updated_at']
        read_only_fields = ['id', 'uploader', 'created_at', 'updated_at']
    
    def create(self, validated_data):
        request = self.context.get('request')
        user = request.user
        validated_data['uploader'] = user
        return super().create(validated_data)
