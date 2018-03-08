# -*- coding: utf-8 -*-
# Generated by Django 1.11 on 2018-03-08 07:59
from __future__ import unicode_literals

import colorfield.fields
from django.conf import settings
from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    initial = True

    dependencies = [
        migrations.swappable_dependency(settings.AUTH_USER_MODEL),
        ('project_app', '0001_initial'),
    ]

    operations = [
        migrations.CreateModel(
            name='SprintBoard',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('title', models.CharField(max_length=512)),
                ('belonging_id', models.IntegerField(blank=True, null=True)),
                ('number', models.IntegerField(blank=True, null=True)),
                ('color', colorfield.fields.ColorField(blank=True, default='#FF0000', max_length=18, null=True)),
                ('delete_flg', models.BooleanField(default=False)),
                ('created_date', models.DateField(auto_now_add=True)),
                ('className', models.CharField(blank=True, max_length=512, null=True)),
                ('project', models.ForeignKey(blank=True, null=True, on_delete=django.db.models.deletion.CASCADE, to='project_app.Project')),
                ('username', models.ForeignKey(blank=True, null=True, on_delete=django.db.models.deletion.CASCADE, to=settings.AUTH_USER_MODEL)),
            ],
        ),
    ]
