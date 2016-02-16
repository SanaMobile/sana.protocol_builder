# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('api', '0010_remove_element_concept'),
    ]

    operations = [
        migrations.AddField(
            model_name='element',
            name='concept',
            field=models.ForeignKey(related_name='elements', to='api.Concept', null=True),
        ),
    ]
