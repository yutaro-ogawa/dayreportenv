from rest_framework import serializers
from .models import SprintBoard

class SprintBoardSerializer(serializers.ModelSerializer):
    class Meta:
        model = SprintBoard
        fields = ("id","title", "belonging_id","number", "project","color", "delete_flg", "created_date","username")
