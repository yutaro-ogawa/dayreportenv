from rest_framework import serializers
from .models import Code

username = serializers

class CodeSerializer(serializers.ModelSerializer):
    class Meta:
        model = Code
        fields = ("id","title", "code_id", "code_color","delete_flg", "created_date","username")
