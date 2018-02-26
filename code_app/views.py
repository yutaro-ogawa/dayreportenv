import django_filters
from rest_framework import viewsets, filters
from .models import Code
from .serializer import CodeSerializer
from rest_framework import permissions
from rest_framework.permissions import BasePermission
from django.contrib.auth.models import User
import datetime
from django.views.generic import View
from django.shortcuts import render
from django.core.urlresolvers import reverse_lazy
from django.contrib.auth.mixins import LoginRequiredMixin
from .models import Code

# Create your views here.
class CodeView(LoginRequiredMixin, View):
    '''タスクコードコードの管理画面'''
    login_url=reverse_lazy("login")

    def get(self, request):
        return render(request, 'code_app/code.html')


class CodeViewSet(viewsets.ModelViewSet):
    queryset = Code.objects.all()
    serializer_class = CodeSerializer
    permission_classes = [permissions.IsAuthenticated]
    #permission_classes = (IsAdmin,)

    def get_queryset(self):
        # ここで、フィルターして自分のだけを表示している
        queryset = Code.objects.filter(username=self.request.user)
        # delete_flgのチェック
<<<<<<< HEAD
        queryset = queryset.filter(delete_flg=False)
=======
        queryset = Code.objects.filter(delete_flg=False)

>>>>>>> origin/master
        return queryset

    def perform_create(self, serializer):
        serializer.save(username=self.request.user)  # 自動的に自分のユーザーidで保存する
