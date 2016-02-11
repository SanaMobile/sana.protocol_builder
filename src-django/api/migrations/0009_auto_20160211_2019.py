# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('api', '0008_conditionnode_showif'),
    ]

    operations = [
        migrations.RemoveField(
            model_name='showif',
            name='condition',
        ),
        migrations.AddField(
            model_name='conditionnode',
            name='show_if',
            field=models.ForeignKey(related_name='conditions', blank=True, to='api.ShowIf', null=True),
        ),
        migrations.AlterField(
            model_name='showif',
            name='page',
            field=models.ForeignKey(related_name='show_if', to='api.Page'),
        ),
    ]
