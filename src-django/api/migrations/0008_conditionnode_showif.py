# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('api', '0007_concept'),
    ]

    operations = [
        migrations.CreateModel(
            name='ConditionNode',
            fields=[
                ('id', models.AutoField(verbose_name='ID', serialize=False, auto_created=True, primary_key=True)),
                ('node_type', models.CharField(max_length=8, choices=[(b'AND', b'AND'), (b'OR', b'OR'), (b'NOT', b'NOT'), (b'CRITERIA', b'CRITERIA')])),
                ('criteria_type', models.CharField(blank=True, max_length=8, null=True, choices=[(b'EQUALS', b'EQUALS'), (b'GREATER', b'GREATER'), (b'LESSER', b'LESSER')])),
                ('value', models.TextField(null=True, blank=True)),
                ('last_modified', models.DateTimeField(auto_now=True)),
                ('created', models.DateTimeField(auto_now_add=True)),
                ('criteria_element', models.ForeignKey(blank=True, to='api.Element', null=True)),
                ('parent', models.ForeignKey(related_name='children', blank=True, to='api.ConditionNode', null=True)),
            ],
        ),
        migrations.CreateModel(
            name='ShowIf',
            fields=[
                ('id', models.AutoField(verbose_name='ID', serialize=False, auto_created=True, primary_key=True)),
                ('last_modified', models.DateTimeField(auto_now=True)),
                ('created', models.DateTimeField(auto_now_add=True)),
                ('condition', models.ForeignKey(related_name='show_if', to='api.ConditionNode')),
                ('page', models.ForeignKey(to='api.Page')),
            ],
        ),
    ]
