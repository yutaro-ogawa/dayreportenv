import django_filters
from rest_framework import viewsets, filters
from .models import CalEvent
from .serializer import CalEventModelSerializer
from rest_framework import permissions
from rest_framework.permissions import BasePermission
from django.contrib.auth.models import User

class IsAdmin(BasePermission):
    # adminかどうかを調べる
    def has_permission(self, request, view):
        return request.user.is_superuser


class CalEventViewSet(viewsets.ModelViewSet):
    queryset = CalEvent.objects.all()
    #queryset = CalEvent.objects.filter(username=self.request.user)
    serializer_class = CalEventModelSerializer
    permission_classes = [permissions.IsAuthenticated]
    #permission_classes = (IsAdmin,)

    def get_queryset(self):
        # ここで、フィルターして自分のだけを表示している
        queryset = CalEvent.objects.filter(username=self.request.user)
        return queryset

    def perform_create(self, serializer):
        serializer.save(username=self.request.user)  # 自動的に自分のユーザーidで保存する
