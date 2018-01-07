from rest_framework import serializers
from .models import CalEvent


class CalEventModelSerializer(serializers.ModelSerializer):
    class Meta:
        model = CalEvent
        fields = ["id", "title", "start", "end"]
