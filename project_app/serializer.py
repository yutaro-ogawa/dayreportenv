from rest_framework import serializers
from .models import Project

#username = serializers

class ProjectSerializer(serializers.ModelSerializer):
    class Meta:
        model = Project
        fields = ("id","title", "project_id", "project_color","delete_flg", "created_date","username")
