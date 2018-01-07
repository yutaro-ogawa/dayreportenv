from rest_framework import generics
from .models import CalEvent
from .serializer import CalEventModelSerializer
from rest_framework import permissions

class CalEventCreateAPIView(generics.CreateAPIView):
    serializer_class = CalEventModelSerializer
    permission_classes = [permissions.IsAuthenticated]

    def perform_create(self, serializer):
        #serializer.save(username =self.request.user)
        serializer.save()
