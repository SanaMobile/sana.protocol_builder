# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.db import models, migrations


class Migration(migrations.Migration):

    dependencies = [
        ('api', '0005_auto_20150524_1825'),
    ]

    operations = [
        migrations.AlterModelOptions(
            name='element',
            options={'ordering': ['page', 'display_index']},
        ),
        migrations.AlterField(
            model_name='element',
            name='display_index',
            field=models.PositiveIntegerField(),
        ),
        migrations.AlterField(
            model_name='page',
            name='display_index',
            field=models.PositiveIntegerField(),
        ),
    ]
