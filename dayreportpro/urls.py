"""test2pro URL Configuration

The `urlpatterns` list routes URLs to views. For more information please see:
    https://docs.djangoproject.com/en/1.11/topics/http/urls/
Examples:
Function views
    1. Add an import:  from my_app import views
    2. Add a URL to urlpatterns:  url(r'^$', views.home, name='home')
Class-based views
    1. Add an import:  from other_app.views import Home
    2. Add a URL to urlpatterns:  url(r'^$', Home.as_view(), name='home')
Including another URLconf
    1. Import the include() function: from django.conf.urls import url, include
    2. Add a URL to urlpatterns:  url(r'^blog/', include('blog.urls'))
"""
from django.conf.urls import url, include
from django.contrib import admin

# ユーザーの新規登録
from django.views.generic import TemplateView
from site_manage_app.views import Register

# api
from dayreport_app.urls import router as calevent_router

urlpatterns = [
    url(r'^admin/', admin.site.urls),
    url(r'^', include('django.contrib.auth.urls')),  # ログイン、ログアウト用
    url(r'^register/success/$', TemplateView.as_view(
        template_name="registration/register_success.html"), name="register-success"),
    url(r'^register$', Register.as_view(), name="register"),
    url(r'^', include('site_manage_app.urls')),  # 追加
    url(r'^', include('dayreport_app.urls')),  # 追加    
    url(r'^api/', include(calevent_router.urls)), # 追加
]
