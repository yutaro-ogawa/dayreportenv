import django_filters
from rest_framework import viewsets, filters
from .models import CalEvent
from .serializer import CalEventModelSerializer
from rest_framework import permissions
from rest_framework.permissions import BasePermission
from django.contrib.auth.models import User
import datetime
from django.views.generic import View
from django.shortcuts import render
from django.core.urlresolvers import reverse_lazy
from django.contrib.auth.mixins import LoginRequiredMixin


class DayreportView(LoginRequiredMixin, View):
    '''目標一覧画面'''
    login_url = reverse_lazy("login")
    def get(self, request):
        return render(request, 'dayreport_app/dayreport.html')

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

        if "start_date" in self.request.GET:
            start_date = self.request.GET.get("start_date")
            end_date = self.request.GET.get("end_date")

            tdatetime = datetime.datetime.strptime(start_date, '%Y-%m-%d')
            start_date = datetime.date(
                tdatetime.year, tdatetime.month, tdatetime.day)

            tdatetime = datetime.datetime.strptime(end_date, '%Y-%m-%d')
            end_date = datetime.date(
                tdatetime.year, tdatetime.month, tdatetime.day)

            print(start_date)
            print(end_date)
            # 日付のフィルター
            queryset = queryset.filter(start__range=[start_date, end_date])

        return queryset

    def perform_create(self, serializer):
        serializer.save(username=self.request.user)  # 自動的に自分のユーザーidで保存する
