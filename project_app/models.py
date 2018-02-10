from django.db import models
from django.contrib.auth.models import User
from django.core.urlresolvers import reverse
# Create your models here.


class Project(models.Model):
    #id = models.IntegerField(primary_key=True)
    title = models.CharField(max_length=512)
    p_num = models.CharField(max_length=512)
    p_color = models.CharField(max_length=512)
    p_code = models.ForeignKey(Code)
    created_date = models.DateField(auto_now_add=True)
    className = models.CharField(max_length=512, blank=True, null=True) # //色用の変更180131
    username = models.ForeignKey(
        User, blank=True, null=True, related_name="writername")

    def __str__(self):
        return self.title
