from rest_framework import serializers
from models import Procedure


class ProcedureSerializer(serializers.ModelSerializer):
    class Meta:
        model = Procedure
        fields = (
            'id',
            'title',
            'author',
            'version',
            'uuid',
            'owner',
            'pages'
        )
