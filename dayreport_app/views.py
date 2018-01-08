import django_filters
from rest_framework import viewsets, filters
from .models import CalEvent
from .serializer import CalEventModelSerializer
from rest_framework import permissions


class CalEventViewSet(viewsets.ModelViewSet):
    queryset = CalEvent.objects.all()
    serializer_class = CalEventModelSerializer
    permission_classes = [permissions.IsAuthenticated]

    def perform_create(self, serializer):
        serializer.save(username =self.request.user) # 自動的に自分のユーザーidで保存する
