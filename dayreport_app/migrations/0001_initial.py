# -*- coding: utf-8 -*-
# Generated by Django 1.11 on 2018-01-07 10:16
from __future__ import unicode_literals

from django.conf import settings
from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    initial = True

    dependencies = [
        migrations.swappable_dependency(settings.AUTH_USER_MODEL),
    ]

    operations = [
        migrations.CreateModel(
            name='CalEvent',
            fields=[
                ('title', models.CharField(max_length=512)),
                ('start', models.CharField(max_length=512)),
                ('end', models.CharField(max_length=512)),
                ('id', models.IntegerField(primary_key=True, serialize=False)),
                ('created_date', models.DateField(auto_now_add=True)),
                ('username', models.ForeignKey(blank=True, null=True, on_delete=django.db.models.deletion.CASCADE, related_name='writername', to=settings.AUTH_USER_MODEL)),
            ],
        ),
    ]
