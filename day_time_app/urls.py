from rest_framework import routers
from .views import DaytimeView
from django.conf.urls import url



#router = routers.DefaultRouter()
#router.register(r'calevent',CalEventViewSet)

app_name = 'day_time_app'

urlpatterns = [
    url(r'^daytime/', DaytimeView.as_view(), name="daytime"), # 画面
]
