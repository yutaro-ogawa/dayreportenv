from django.db import models
from django.contrib.auth.models import User
from django.core.urlresolvers import reverse
from colorfield.fields import ColorField# 色を使えるように拡張



# Create your models here.
class SprintBoard(models.Model):
    #id = models.IntegerField(primary_key=True)
    title = models.CharField(max_length=512)
    belonging_id = models.IntegerField(blank=True, null=True)
    number = models.IntegerField(blank=True, null=True)
    project = models.ForeignKey("project_app.Project", blank=True, null=True)
    color = ColorField(default='#FF0000', blank=True, null=True)
    delete_flg =models.BooleanField(default=False)
    created_date = models.DateField(auto_now_add=True)
    className = models.CharField(max_length=512, blank=True, null=True) # //色用の変更180131
    username = models.ForeignKey(User, blank=True, null=True)

    def __str__(self):
        return self.title
