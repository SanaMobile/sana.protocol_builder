from django.contrib.auth.models import User
from rest_framework import serializers
from models import Procedure


class ProcedureSerializer(serializers.HyperlinkedModelSerializer):
    owner = serializers.PrimaryKeyRelatedField(
        write_only=True,
        queryset=User.objects.all()
    )

    class Meta:
        model = Procedure
        fields = (
            'title',
            'author',
            'version',
            'uuid',
            'owner'
        )
