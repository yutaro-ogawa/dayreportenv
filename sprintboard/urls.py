from rest_framework import routers
from .views import SprintBoardView
from .views import SprintBoardViewSet
from django.conf.urls import url


# Web api
router = routers.DefaultRouter()
router.register(r'sprintboard',SprintBoardViewSet)

app_name = 'sprintboard'

urlpatterns = [
    url(r'^sprintboard/', SprintBoardView.as_view(), name="sprintboard"), # 画面
]
