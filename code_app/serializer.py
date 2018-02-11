from rest_framework import serializers
from .models import Code

username = serializers

class CodeSerializer(serializers.ModelSerializer):
    class Meta:
        model = Code
        fields = ("title", "code_id", "code_color", "created_date","username")
