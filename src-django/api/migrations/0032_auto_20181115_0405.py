# -*- coding: utf-8 -*-
# Generated by Django 1.11 on 2018-11-15 04:05
from __future__ import unicode_literals

from django.db import migrations


class Migration(migrations.Migration):

    dependencies = [
        ('api', '0031_mdsinstance'),
    ]

    operations = [
        migrations.RenameField(
            model_name='mdsinstance',
            old_name='url',
            new_name='api_url',
        ),
    ]
