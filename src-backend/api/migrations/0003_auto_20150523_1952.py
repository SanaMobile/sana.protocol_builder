# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.db import models, migrations


class Migration(migrations.Migration):

    dependencies = [
        ('api', '0002_auto_20150523_1851'),
    ]

    operations = [
        migrations.CreateModel(
            name='Element',
            fields=[
                ('id', models.AutoField(verbose_name='ID', serialize=False, auto_created=True, primary_key=True)),
                ('display_index', models.IntegerField()),
                ('eid', models.CharField(max_length=255)),
                ('concept', models.TextField()),
                ('question', models.TextField()),
                ('default_answer', models.TextField()),
            ],
        ),
        migrations.CreateModel(
            name='EntryElement',
            fields=[
                ('id', models.AutoField(verbose_name='ID', serialize=False, auto_created=True, primary_key=True)),
                ('numeric', models.CharField(max_length=255, null=True)),
            ],
        ),
        migrations.AddField(
            model_name='page',
            name='display_index',
            field=models.IntegerField(default=0),
            preserve_default=False,
        ),
        migrations.AddField(
            model_name='procedure',
            name='uuid',
            field=models.CharField(max_length=36, null=True),
        ),
        migrations.AlterField(
            model_name='page',
            name='procedure',
            field=models.ForeignKey(related_name='pages', to='api.Procedure'),
        ),
        migrations.AlterField(
            model_name='procedure',
            name='version',
            field=models.CharField(max_length=255, null=True),
        ),
        migrations.AlterUniqueTogether(
            name='page',
            unique_together=set([('display_index', 'procedure')]),
        ),
        migrations.CreateModel(
            name='ChoiceElement',
            fields=[
                ('element_ptr', models.OneToOneField(parent_link=True, auto_created=True, primary_key=True, serialize=False, to='api.Element')),
                ('element_type', models.CharField(max_length=12, choices=[(b'SELECT', b'SELECT'), (b'MULTI_SELECT', b'MULTI_SELECT'), (b'RADIO', b'RADIO')])),
                ('choices', models.TextField()),
            ],
            bases=('api.element',),
        ),
        migrations.CreateModel(
            name='SingleValueElement',
            fields=[
                ('element_ptr', models.OneToOneField(parent_link=True, auto_created=True, primary_key=True, serialize=False, to='api.Element')),
                ('element_type', models.CharField(max_length=12, choices=[(b'GPS', b'GPS'), (b'SOUND', b'SOUND'), (b'PICTURE', b'PICTURE')])),
            ],
            bases=('api.element',),
        ),
        migrations.AddField(
            model_name='element',
            name='page',
            field=models.ForeignKey(related_name='elements', to='api.Page'),
        ),
        migrations.AlterUniqueTogether(
            name='element',
            unique_together=set([('display_index', 'page')]),
        ),
    ]
