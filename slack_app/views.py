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
from .models import Slack_text
from .serializer import Slack_textSerializer


# Create your views here.
class Slack_textView(LoginRequiredMixin, View):
    '''postする内容の表示画面'''
    login_url=reverse_lazy("login")

    def get(self, request):
        return render(request, 'slack_app/postcontents.html')


class Slack_textViewSet(viewsets.ModelViewSet):
    '''Web apiでとってくる '''
    queryset = Slack_text.objects.all()
    serializer_class = Slack_textSerializer


    def get_queryset(self):
        # ここで、フィルターして自分のだけを表示している
        queryset =  Slack_text.objects.filter(username=self.request.user)
        return queryset

    def perform_create(self, serializer):
        serializer.save(username=self.request.user)  # 自動的に自分のユーザーidで保存する
