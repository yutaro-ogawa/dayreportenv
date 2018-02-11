from rest_framework import routers
from .views import CodeView
from .views import CodeViewSet
from django.conf.urls import url



router = routers.DefaultRouter()
router.register(r'code',CodeViewSet)

app_name = 'code_app'

urlpatterns = [
    url(r'^code/', CodeView.as_view(), name="code"), # 画面
]
