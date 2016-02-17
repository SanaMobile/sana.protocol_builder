# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('api', '0011_element_concept'),
    ]

    operations = [
        migrations.AddField(
            model_name='element',
            name='action',
            field=models.TextField(null=True, blank=True),
        ),
        migrations.AddField(
            model_name='element',
            name='audio',
            field=models.TextField(null=True, blank=True),
        ),
        migrations.AddField(
            model_name='element',
            name='image',
            field=models.TextField(null=True, blank=True),
        ),
        migrations.AddField(
            model_name='element',
            name='mime_type',
            field=models.CharField(max_length=128, null=True, blank=True),
        ),
        migrations.AddField(
            model_name='element',
            name='required',
            field=models.BooleanField(default=False),
        ),
        migrations.AlterField(
            model_name='element',
            name='element_type',
            field=models.CharField(blank=True, max_length=12, null=True, choices=[(b'DATE', b'DATE'), (b'ENTRY', b'ENTRY'), (b'SELECT', b'SELECT'), (b'MULTI_SELECT', b'MULTI_SELECT'), (b'RADIO', b'RADIO'), (b'PICTURE', b'PICTURE'), (b'PLUGIN', b'PLUGIN'), (b'ENTRY_PLUGIN', b'ENTRY_PLUGIN')]),
        ),
    ]
