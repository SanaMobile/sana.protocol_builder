# -*- coding: utf-8 -*-
# Generated by Django 1.9.3 on 2018-01-19 14:22
from __future__ import unicode_literals

from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    dependencies = [
        ('api', '0021_remove_element_eid'),
    ]

    operations = [
        migrations.AlterField(
            model_name='element',
            name='page',
            field=models.ForeignKey(null=True, on_delete=django.db.models.deletion.CASCADE, related_name='elements', to='api.Page'),
        ),
    ]
