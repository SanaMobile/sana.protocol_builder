# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.db import models, migrations
import datetime
from django.utils.timezone import utc


class Migration(migrations.Migration):

    dependencies = [
        ('api', '0002_auto_20150605_2258'),
    ]

    operations = [
        migrations.AddField(
            model_name='element',
            name='created',
            field=models.DateField(default=datetime.datetime(2015, 6, 6, 3, 41, 43, 699662, tzinfo=utc), auto_now_add=True),
            preserve_default=False,
        ),
        migrations.AddField(
            model_name='element',
            name='last_modified',
            field=models.DateField(default=datetime.datetime(2015, 6, 6, 3, 41, 47, 163868, tzinfo=utc), auto_now=True),
            preserve_default=False,
        ),
        migrations.AddField(
            model_name='page',
            name='created',
            field=models.DateField(default=datetime.datetime(2015, 6, 6, 3, 41, 58, 91929, tzinfo=utc), auto_now_add=True),
            preserve_default=False,
        ),
        migrations.AddField(
            model_name='page',
            name='last_modified',
            field=models.DateField(default=datetime.datetime(2015, 6, 6, 3, 42, 1, 859588, tzinfo=utc), auto_now=True),
            preserve_default=False,
        ),
        migrations.AddField(
            model_name='procedure',
            name='created',
            field=models.DateField(default=datetime.datetime(2015, 6, 6, 3, 42, 5, 419529, tzinfo=utc), auto_now_add=True),
            preserve_default=False,
        ),
        migrations.AddField(
            model_name='procedure',
            name='last_modified',
            field=models.DateField(default=datetime.datetime(2015, 6, 6, 3, 42, 9, 219634, tzinfo=utc), auto_now=True),
            preserve_default=False,
        ),
    ]
