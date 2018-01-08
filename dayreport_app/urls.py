from rest_framework import routers
from .views import CalEventViewSet

router = routers.DefaultRouter()
router.register(r'calevent',CalEventViewSet)
