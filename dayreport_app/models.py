from django.db import models
from django.contrib.auth.models import User
from django.core.urlresolvers import reverse
# Create your models here.


class CalEvent(models.Model):
    title = models.CharField(max_length=512)
    start = models.CharField(max_length=512)
    end = models.CharField(max_length=512)
    #id = models.IntegerField(primary_key=True)
    id = models.CharField(max_length=512, primary_key=True)
    created_date = models.DateField(auto_now_add=True)
    #username = models.ForeignKey(
    #    User, blank=True, null=True, related_name="writername")

    def __str__(self):
        return self.title
