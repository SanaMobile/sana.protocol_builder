# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.db import models, migrations


class Migration(migrations.Migration):

    dependencies = [
        ('api', '0003_auto_20150606_0342'),
    ]

    operations = [
        migrations.AlterField(
            model_name='element',
            name='answer',
            field=models.TextField(null=True, blank=True),
        ),
        migrations.AlterField(
            model_name='element',
            name='choices',
            field=models.TextField(null=True, blank=True),
        ),
        migrations.AlterField(
            model_name='element',
            name='concept',
            field=models.TextField(null=True, blank=True),
        ),
        migrations.AlterField(
            model_name='element',
            name='eid',
            field=models.CharField(max_length=255, null=True, blank=True),
        ),
        migrations.AlterField(
            model_name='element',
            name='numeric',
            field=models.CharField(max_length=255, null=True, blank=True),
        ),
        migrations.AlterField(
            model_name='element',
            name='question',
            field=models.TextField(null=True, blank=True),
        ),
    ]
