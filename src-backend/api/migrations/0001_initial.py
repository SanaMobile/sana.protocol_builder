# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.db import models, migrations
from django.conf import settings


class Migration(migrations.Migration):

    dependencies = [
        migrations.swappable_dependency(settings.AUTH_USER_MODEL),
    ]

    operations = [
        migrations.CreateModel(
            name='Element',
            fields=[
                ('id', models.AutoField(verbose_name='ID', serialize=False, auto_created=True, primary_key=True)),
                ('display_index', models.PositiveIntegerField()),
                ('eid', models.CharField(max_length=255)),
                ('element_type', models.CharField(max_length=12, choices=[(b'SELECT', b'SELECT'), (b'MULTI_SELECT', b'MULTI_SELECT'), (b'RADIO', b'RADIO'), (b'GPS', b'GPS'), (b'SOUND', b'SOUND'), (b'PICTURE', b'PICTURE'), (b'ENTRY', b'ENTRY')])),
                ('choices', models.TextField(null=True)),
                ('numeric', models.CharField(max_length=255, null=True)),
                ('concept', models.TextField()),
                ('question', models.TextField()),
                ('answer', models.TextField(blank=True)),
            ],
            options={
                'ordering': ['page', 'display_index'],
            },
        ),
        migrations.CreateModel(
            name='Page',
            fields=[
                ('id', models.AutoField(verbose_name='ID', serialize=False, auto_created=True, primary_key=True)),
                ('display_index', models.PositiveIntegerField()),
            ],
            options={
                'ordering': ['procedure', 'display_index'],
            },
        ),
        migrations.CreateModel(
            name='Procedure',
            fields=[
                ('id', models.AutoField(verbose_name='ID', serialize=False, auto_created=True, primary_key=True)),
                ('title', models.CharField(max_length=255)),
                ('author', models.CharField(max_length=255)),
                ('version', models.CharField(max_length=255, null=True)),
                ('uuid', models.CharField(max_length=36, null=True)),
                ('owner', models.ForeignKey(to=settings.AUTH_USER_MODEL)),
            ],
        ),
        migrations.AddField(
            model_name='page',
            name='procedure',
            field=models.ForeignKey(related_name='pages', to='api.Procedure'),
        ),
        migrations.AddField(
            model_name='element',
            name='page',
            field=models.ForeignKey(related_name='elements', to='api.Page'),
        ),
        migrations.AlterUniqueTogether(
            name='page',
            unique_together=set([('display_index', 'procedure')]),
        ),
        migrations.AlterUniqueTogether(
            name='element',
            unique_together=set([('display_index', 'page')]),
        ),
    ]
