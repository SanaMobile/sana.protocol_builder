# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('api', '0016_auto_20160225_0329'),
    ]

    operations = [
        migrations.RemoveField(
            model_name='procedure',
            name='uuid',
        ),
        migrations.RemoveField(
            model_name='procedure',
            name='version',
        ),
    ]
