from collections import OrderedDict
from rest_framework import serializers
from rest_framework.fields import SkipField
import models


class ElementSerializer(serializers.ModelSerializer):
    class Meta:
        model = models.Element
        fields = (
            'id',
            'display_index',
            'eid',
            'concept',
            'question',
            'answer',
            'page',
            'choices',
            'numeric',
            'element_type'
        )

    def to_representation(self, instance):
        """
        Object instance -> Dict of primitive datatypes.
        """
        ret = OrderedDict()
        fields = [field for field in self.fields.values() if not field.write_only]

        for field in fields:
            try:
                attribute = field.get_attribute(instance)
            except SkipField:
                continue

            if attribute is not None:
                ret[field.field_name] = field.to_representation(attribute)

        return ret


class PageSerializer(serializers.ModelSerializer):
    class Meta:
        model = models.Page
        fields = (
            'id',
            'display_index',
            'procedure',
            'elements'
        )


class ProcedureSerializer(serializers.ModelSerializer):
    class Meta:
        model = models.Procedure
        fields = (
            'id',
            'title',
            'author',
            'version',
            'uuid',
            'owner',
            'pages'
        )
