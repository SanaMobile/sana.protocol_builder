# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.db import models, migrations


class Migration(migrations.Migration):

    dependencies = [
        ('api', '0004_auto_20150623_1841'),
    ]

    operations = [
        migrations.AlterField(
            model_name='element',
            name='element_type',
            field=models.CharField(blank=True, max_length=12, null=True, choices=[(b'SELECT', b'SELECT'), (b'MULTI_SELECT', b'MULTI_SELECT'), (b'RADIO', b'RADIO'), (b'GPS', b'GPS'), (b'SOUND', b'SOUND'), (b'PICTURE', b'PICTURE'), (b'ENTRY', b'ENTRY')]),
        ),
    ]
