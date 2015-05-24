from django.contrib.auth.models import User
from rest_framework import serializers
from models import Procedure


class ProcedureSerializer(serializers.HyperlinkedModelSerializer):
    owner = serializers.PrimaryKeyRelatedField(
        queryset=User.objects.all()
    )

    class Meta:
        model = Procedure
        fields = (
            'id',
            'title',
            'author',
            'version',
            'uuid',
            'owner'
        )
