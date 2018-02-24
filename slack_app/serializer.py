from rest_framework import serializers
from .models import Slack_text

#これいる？
#username = serializers

class Slack_textSerializer(serializers.ModelSerializer):
    class Meta:
        model = Slack_text
        fields = ("detail","created_date","username")
