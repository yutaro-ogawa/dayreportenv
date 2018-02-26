from django.conf.urls import url
from. import views

app_name = 'site_manage_app'

urlpatterns=[
    url(r'^$', views.IndexView.as_view(), name='index')
]
