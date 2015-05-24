# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.db import models, migrations


class Migration(migrations.Migration):

    dependencies = [
        ('api', '0002_auto_20150524_2252'),
    ]

    operations = [
        migrations.AlterField(
            model_name='element',
            name='answer',
            field=models.TextField(blank=True),
        ),
    ]
