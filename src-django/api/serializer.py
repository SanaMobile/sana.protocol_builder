from collections import OrderedDict
from rest_framework import serializers
from rest_framework.fields import SkipField
from django.contrib.auth.models import User
import models
import field
import json


class ElementSerializer(serializers.ModelSerializer):
    choices = field.ArrayAsStringField(required=False)
    answer = field.ArrayAsStringField(required=False)

    class Meta:
        model = models.Element
        fields = (
            'id',
            'display_index',
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
        if data['element_type'] in models.Element.CHOICE_TYPES:
            # Choice-based element needs to have a valid answer
            answers = json.loads(data['answer'])
            choices = json.loads(data['choices'])

            if data['element_type'] != 'MULTI_SELECT':
                if len(answers) > 1:
                    raise serializers.ValidationError('Answer must have at most 1 choice')

            for answer in answers:
                if answer not in choices:
                    raise serializers.ValidationError('Answer must be one of the choices')

        return data

class AbstractElementSerializer(serializers.ModelSerializer):
    choices = field.ArrayAsStringField(required=False)
    answer = field.ArrayAsStringField(required=False)

    class Meta:
        model = models.AbstractElement
        fields = (
            'id',
            'display_index',
            'concept',
            'question',
            'answer',
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
        if data['element_type'] in models.Element.CHOICE_TYPES:
            # Choice-based element needs to have a valid answer
            answers = json.loads(data['answer'])
            choices = json.loads(data['choices'])

            if data['element_type'] != 'MULTI_SELECT':
                if len(answers) > 1:
                    raise serializers.ValidationError('Answer must have at most 1 choice')

            for answer in answers:
                if answer not in choices:
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
            'last_modified',
            'created'
        )


class ProcedureDetailSerializer(ProcedureSerializer):
    owner = serializers.ReadOnlyField(source='owner.id')
    pages = PageSerializer(many=True, read_only=True)

    class Meta(ProcedureSerializer.Meta):
        model = models.Procedure
        depth = 1
        fields = ProcedureSerializer.Meta.fields + ('pages',)


class ConceptSerializer(serializers.ModelSerializer):
    abstractelements = AbstractElementSerializer(many=True, read_only=True)
    id = serializers.IntegerField(read_only=False, required=False)

    class Meta:
        model = models.Concept
        fields = (
            'id',
            'uuid',
            'created',
            'last_modified',
            'name',
            'abstractelements',
            'display_name',
            'description',
            'data_type',
            'mime_type',
            'constraint'
        )
