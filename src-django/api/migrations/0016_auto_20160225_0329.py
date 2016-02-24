# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('api', '0015_auto_20160218_0306'),
    ]

    operations = [
        migrations.RemoveField(
            model_name='conditionnode',
            name='criteria_element',
        ),
        migrations.RemoveField(
            model_name='conditionnode',
            name='parent',
        ),
        migrations.RemoveField(
            model_name='conditionnode',
            name='show_if',
        ),
        migrations.AddField(
            model_name='showif',
            name='conditions',
            field=models.TextField(default=''),
            preserve_default=False,
        ),
        migrations.DeleteModel(
            name='ConditionNode',
        ),
    ]
