import django_filters
from rest_framework import viewsets, filters
from rest_framework import permissions
from rest_framework.permissions import BasePermission
from django.contrib.auth.models import User
import datetime
from django.views.generic import View
from django.shortcuts import render
from django.core.urlresolvers import reverse_lazy
from django.contrib.auth.mixins import LoginRequiredMixin

# import
from .models import Label
from .serializer import LabelSerializer


# Create your views here.
class LabelView(LoginRequiredMixin, View):
    '''ラベルの管理画面'''
    login_url=reverse_lazy("login")

    def get(self, request):
        return render(request, 'label_app/label.html')


class LabelViewSet(viewsets.ModelViewSet):
    '''Web apiでとってくる '''
    queryset = Label.objects.all()
    serializer_class = LabelSerializer
    permission_classes = [permissions.IsAuthenticated]
    #permission_classes = (IsAdmin,)

    def get_queryset(self):
        # ここで、フィルターして自分のだけを表示している
        queryset = Label.objects.filter(username=self.request.user)
        # delete_flgのチェック
<<<<<<< HEAD
        queryset = queryset.filter(delete_flg=False)
=======
        queryset = Label.objects.filter(delete_flg=False)
>>>>>>> origin/master

        return queryset

    def perform_create(self, serializer):
        serializer.save(username=self.request.user)  # 自動的に自分のユーザーidで保存する
