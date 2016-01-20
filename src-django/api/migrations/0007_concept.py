# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.db import migrations, models
import uuid


class Migration(migrations.Migration):

    dependencies = [
        ('api', '0006_auto_20150714_2302'),
    ]

    operations = [
        migrations.CreateModel(
            name='Concept',
            fields=[
                ('id', models.AutoField(verbose_name='ID', serialize=False, auto_created=True, primary_key=True)),
                ('uuid', models.UUIDField(default=uuid.uuid4, editable=False)),
                ('created', models.DateTimeField(auto_now_add=True)),
                ('last_modified', models.DateTimeField(auto_now=True)),
                ('name', models.CharField(max_length=255)),
                ('display_name', models.CharField(max_length=255)),
                ('description', models.TextField(null=True, blank=True)),
                ('data_type', models.CharField(blank=True, max_length=16, null=True, choices=[(b'string', b'string'), (b'boolean', b'boolean'), (b'number', b'number'), (b'complex', b'complex')])),
                ('mime_type', models.CharField(max_length=128, null=True, blank=True)),
                ('constraint', models.TextField(null=True, blank=True)),
            ],
        ),
    ]
