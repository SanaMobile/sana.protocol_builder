from collections import OrderedDict
from rest_framework import serializers
from rest_framework.fields import SkipField
from django.contrib.auth.models import User
import models
import field
import json


class ElementSerializer(serializers.ModelSerializer):
    choices = field.ElementChoicesField(required=False)

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
            'required',
            'image',
            'audio',
            'action',
            'mime_type',
            'element_type',
            'last_modified',
            'created'
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

    def validate(self, data):
        if (data['element_type'] in models.Element.CHOICE_TYPES and
           'answer' in data and data['answer'] not in json.loads(data['choices'])):
            raise serializers.ValidationError('Answer must be one of the choices')

        return data


class UserSerializer(serializers.ModelSerializer):

    class Meta:
        model = User


class PageListSerializer(serializers.ListSerializer):

    class Meta(object):
        model = models.Page

    def update(self, instance, validated_data):
        current_page_mapping = {page.id: page for page in instance}
        new_data_mapping = {item['id']: item for item in validated_data}

        result = []
        for new_page_id, data in new_data_mapping.items():
            page = current_page_mapping.get(new_page_id, None)
            if page is not None:
                result.append(self.child.update(page, data))

        return result


class ShowIfSerializer(serializers.ModelSerializer):
    conditions = field.ConditionTreeField(required=True)

    class Meta:
        model = models.ShowIf
        fields = (
            'id',
            'page',
            'last_modified',
            'created',
            'conditions'
        )


class PageSerializer(serializers.ModelSerializer):
    elements = ElementSerializer(many=True, read_only=True)
    show_if = ShowIfSerializer(many=True, read_only=True)
    id = serializers.IntegerField(read_only=False, required=False)

    class Meta:
        model = models.Page
        list_serializer_class = PageListSerializer
        fields = (
            'id',
            'display_index',
            'procedure',
            'elements',
            'last_modified',
            'created',
            'show_if'
        )


class ProcedureSerializer(serializers.ModelSerializer):
    owner = serializers.ReadOnlyField(source='owner.id')

    class Meta:
        model = models.Procedure
        fields = (
            'id',
            'title',
            'author',
            'uuid',
            'owner',
            'pages',
            'last_modified',
            'created'
        )


class ProcedureDetailSerializer(ProcedureSerializer):
    owner = serializers.ReadOnlyField(source='owner.id')

    class Meta(ProcedureSerializer.Meta):
        model = models.Procedure
        depth = 1
        fields = ProcedureSerializer.Meta.fields


class ConceptSerializer(serializers.ModelSerializer):
    class Meta:
        model = models.Concept
        fields = (
            'id',
            'uuid',
            'created',
            'last_modified',
            'name',
            'display_name',
            'description',
            'data_type',
            'mime_type',
            'constraint'
        )
