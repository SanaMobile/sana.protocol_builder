from collections import OrderedDict
from rest_framework import serializers
from rest_framework.fields import SkipField
from rest_framework_recursive.fields import RecursiveField
import models
import field


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


class ConditionNodeSerializer(serializers.ModelSerializer):
    children = RecursiveField(many=True, required=False)

    class Meta:
        model = models.ConditionNode
        fields = (
            'id',
            'parent',
            'criteria_element',
            'node_type',
            'criteria_type',
            'value',
            'last_modified',
            'created',
            'show_if',
            'children'
        )

    def create(self, validated_data):
        if 'children' in validated_data:
            children_data = validated_data.pop('children')
            condition = models.ConditionNode.objects.create(**validated_data)

            for child_data in children_data:
                child_data['parent'] = condition
                self.create(child_data)

            return condition
        else:
            return super(ConditionNodeSerializer, self).create(validated_data)


class ShowIfSerializer(serializers.ModelSerializer):
    conditions = ConditionNodeSerializer(many=True)

    class Meta:
        model = models.ShowIf
        fields = (
            'id',
            'page',
            'last_modified',
            'created',
            'conditions'
        )

    def create(self, validated_data):
        if 'conditions' in validated_data:
            conditions_data = validated_data.pop('conditions')
            show_if = models.ShowIf.objects.create(**validated_data)

            for condition_data in conditions_data:
                self.__create_nested_children(condition_data, show_if)

            return show_if
        else:
            return super(ShowIfSerializer, self).create(validated_data)

    def update(self, instance, validated_data):
        instance.page = validated_data.get('page', instance.page)
        instance.conditions.all().delete()

        if 'conditions' in validated_data:
            conditions_data = validated_data.pop('conditions')
            for condition_data in conditions_data:
                self.__create_nested_children(condition_data, instance)

        return instance

    def __create_nested_children(self, data, show_if):
            if 'children' in data:
                children_data = data.pop('children')
                condition = models.ConditionNode.objects.create(show_if=show_if, **data)
                for child_data in children_data:
                    child_data['parent'] = condition
                    self.__create_nested_children(child_data, None)
            else:
                models.ConditionNode.objects.create(show_if=show_if, **data)


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
            'version',
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
