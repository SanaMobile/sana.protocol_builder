# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('api', '0012_auto_20160216_2324'),
    ]

    operations = [
        migrations.AlterField(
            model_name='conditionnode',
            name='criteria_type',
            field=models.CharField(blank=True, max_length=8, null=True, choices=[(b'EQUALS', b'EQUALS'), (b'GREATER', b'GREATER'), (b'LESS', b'LESS')]),
        ),
    ]
