from rest_framework import routers
from .views import CalEventViewSet
from .views import DayreportView
from django.conf.urls import url



router = routers.DefaultRouter()
router.register(r'calevent',CalEventViewSet)

app_name = 'dayreport_app'

urlpatterns = [
    url(r'^dayreport/', DayreportView.as_view(), name="dayreport"), # 画面
]
