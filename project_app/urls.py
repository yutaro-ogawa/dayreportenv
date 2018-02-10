from rest_framework import routers
from .views import ProjectView
from django.conf.urls import url



#router = routers.DefaultRouter()
#router.register(r'calevent',CalEventViewSet)

app_name = 'project_app'

urlpatterns = [
    url(r'^project/', ProjectView.as_view(), name="project"), # 画面
]
