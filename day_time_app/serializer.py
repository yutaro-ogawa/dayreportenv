from rest_framework import serializers
from .models import Day_time

#これいる？
#username = serializers

class Day_timeSerializer(serializers.ModelSerializer):
    class Meta:
        model = Day_time
        fields = ("id","title", "place","start","end","project","task","label","hurikaeri","color","delete_flg", "created_date","username")
