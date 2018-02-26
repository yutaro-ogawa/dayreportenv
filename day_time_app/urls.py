from rest_framework import routers
from .views import Day_timeView
from .views import Day_timeViewSet
from django.conf.urls import url


# Web api
router = routers.DefaultRouter()
router.register(r'day_time',Day_timeViewSet)

app_name = 'day_time_app'

urlpatterns = [
    url(r'^day_time/', Day_timeView.as_view(), name="day_time"), # 画面
]
