# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('api', '0014_auto_20160217_2314'),
    ]

    operations = [
        migrations.AlterField(
            model_name='element',
            name='element_type',
            field=models.CharField(max_length=12, choices=[(b'DATE', b'DATE'), (b'ENTRY', b'ENTRY'), (b'SELECT', b'SELECT'), (b'MULTI_SELECT', b'MULTI_SELECT'), (b'RADIO', b'RADIO'), (b'PICTURE', b'PICTURE'), (b'PLUGIN', b'PLUGIN'), (b'ENTRY_PLUGIN', b'ENTRY_PLUGIN')]),
        ),
    ]
