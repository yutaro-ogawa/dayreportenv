from django.conf.urls import url
from .views import CalEventCreateAPIView

app_name = 'dayreport_app'

urlpatterns = [
    url(r'^api/calevent/create$', CalEventCreateAPIView.as_view(),
        name='api_calevent_create'),  # /api/calevent/create/
]
