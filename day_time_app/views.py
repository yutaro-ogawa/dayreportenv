import django_filters
from rest_framework import viewsets, filters
#from .models import CalEvent
#from .serializer import CalEventModelSerializer
from rest_framework import permissions
from rest_framework.permissions import BasePermission
from django.contrib.auth.models import User
import datetime
from django.views.generic import View
from django.shortcuts import render
from django.core.urlresolvers import reverse_lazy
from django.contrib.auth.mixins import LoginRequiredMixin


# Create your views here.
class DaytimeView(LoginRequiredMixin, View):
    '''一日の時間画面'''
    login_url=reverse_lazy("login")

    def get(self, request):
        return render(request, 'day_time_app/daytime.html')
