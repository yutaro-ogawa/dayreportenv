from rest_framework import routers
from .views import LabelView
from .views import LabelViewSet
from django.conf.urls import url


# Web api
router = routers.DefaultRouter()
router.register(r'label',LabelViewSet)

app_name = 'label_app'

urlpatterns = [
    url(r'^label/', LabelView.as_view(), name="label"), # 画面
]
