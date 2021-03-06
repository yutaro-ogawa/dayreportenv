# -*- coding: utf-8 -*-
# Generated by Django 1.11 on 2018-02-21 04:17
from __future__ import unicode_literals

import colorfield.fields
from django.conf import settings
from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    initial = True

    dependencies = [
        ('project_app', '0001_initial'),
        ('label_app', '0001_initial'),
        ('code_app', '0005_code_delete_flg'),
        migrations.swappable_dependency(settings.AUTH_USER_MODEL),
    ]

    operations = [
        migrations.CreateModel(
            name='Day_time',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('title', models.CharField(max_length=512)),
                ('place', models.CharField(max_length=512)),
                ('start', models.DateField()),
                ('end', models.DateField()),
                ('hurikaeri', models.IntegerField()),
                ('color', colorfield.fields.ColorField(blank=True, default='#FF0000', max_length=18, null=True)),
                ('delete_flg', models.BooleanField(default=False)),
                ('created_date', models.DateField(auto_now_add=True)),
                ('className', models.CharField(blank=True, max_length=512, null=True)),
                ('label', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='label_app.Label')),
                ('project', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='project_app.Project')),
                ('task', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='code_app.Code')),
                ('username', models.ForeignKey(blank=True, null=True, on_delete=django.db.models.deletion.CASCADE, related_name='day_time_writername', to=settings.AUTH_USER_MODEL)),
            ],
        ),
    ]
