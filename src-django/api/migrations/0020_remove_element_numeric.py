# -*- coding: utf-8 -*-
# Generated by Django 1.9.3 on 2016-03-08 05:27
from __future__ import unicode_literals

from django.db import migrations


class Migration(migrations.Migration):

    dependencies = [
        ('api', '0019_auto_20160308_0349'),
    ]

    operations = [
        migrations.RemoveField(
            model_name='element',
            name='numeric',
        ),
    ]