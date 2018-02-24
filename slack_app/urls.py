from rest_framework import routers
from .views import Slack_textView
from .views import Slack_textViewSet
from django.conf.urls import url


# Web api
router = routers.DefaultRouter()
router.register(r'slack',Slack_textViewSet)

app_name = 'slack_app'

urlpatterns = [
    url(r'^slack/', Slack_textView.as_view(), name="slack_postcontents"), # 画面
]
