# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('api', '0013_auto_20160217_1928'),
    ]

    operations = [
        migrations.RemoveField(
            model_name='conditionnode',
            name='criteria_type',
        ),
        migrations.AlterField(
            model_name='conditionnode',
            name='node_type',
            field=models.CharField(max_length=8, choices=[(b'AND', b'AND'), (b'OR', b'OR'), (b'NOT', b'NOT'), (b'EQUALS', b'EQUALS'), (b'GREATER', b'GREATER'), (b'LESS', b'LESS')]),
        ),
    ]
