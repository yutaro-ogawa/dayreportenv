from django.db import models
from django.contrib.auth.models import User
from django.core.urlresolvers import reverse

# Create your models here.
class Slack_text(models.Model):
    #id = models.IntegerField(primary_key=True)
    detail = models.TextField(max_length=51200, blank=True, null=True)
    created_date = models.DateField(auto_now_add=True)
    username = models.ForeignKey(
        User, blank=True, null=True)

    def __str__(self):
        return self.detail
