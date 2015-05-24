# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.db import models, migrations


class Migration(migrations.Migration):

    dependencies = [
        ('api', '0004_auto_20150524_0107'),
    ]

    operations = [
        migrations.AlterModelOptions(
            name='page',
            options={'ordering': ['procedure', 'display_index']},
        ),
    ]
