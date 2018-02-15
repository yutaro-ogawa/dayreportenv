from rest_framework import serializers
from .models import Label

#これいる？
#username = serializers

class LabelSerializer(serializers.ModelSerializer):
    class Meta:
        model = Label
        fields = ("id","title", "label_id", "label_color","delete_flg", "created_date","username")
