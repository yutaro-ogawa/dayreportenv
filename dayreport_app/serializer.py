from rest_framework import serializers
from .models import CalEvent

username = serializers

class CalEventModelSerializer(serializers.ModelSerializer):
    class Meta:
        model = CalEvent
        fields = ("id", "title", "start", "end", "username","className") # //色用の変更180131
