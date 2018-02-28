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
from .models import Day_time
from .serializer import Day_timeSerializer


# Create your views here.
class Day_timeView(LoginRequiredMixin, View):
    '''ラベルの管理画面'''
    login_url=reverse_lazy("login")

    def get(self, request):
        return render(request, 'day_time_app/day_time.html')


class Day_timeViewSet(viewsets.ModelViewSet):
    '''Web apiでとってくる '''
    queryset = Day_time.objects.all()
    serializer_class = Day_timeSerializer
    permission_classes = [permissions.IsAuthenticated]
    #permission_classes = (IsAdmin,)

    def get_queryset(self):
        # ここで、フィルターして自分のだけを表示している

        queryset = Day_time.objects.all().order_by('start').filter(username=self.request.user)
        # delete_flgのチェック
        #queryset = queryset.filter(delete_flg=False)


        # 日付の指定
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
            # 日付のフィルター　全部のフィルターを反映
            queryset = Day_time.objects.all().filter(username=self.request.user)
            queryset = queryset.filter(start__range=[start_date, end_date])
            queryset = queryset.order_by('start')
        return queryset

    def perform_create(self, serializer):
        serializer.save(username=self.request.user)  # 自動的に自分のユーザーidで保存する
