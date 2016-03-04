from rest_framework import serializers
from models import ShowIf
import json


class ArrayAsStringField(serializers.Field):
    def to_representation(self, obj):
        if not obj:
            obj = '[]'

        return json.loads(obj)

    def to_internal_value(self, data):
        if not isinstance(data, list):
            raise serializers.ValidationError('Expected list')

        if not all(isinstance(item, basestring) for item in data):
            raise serializers.ValidationError('All choices should be strings')

        return json.dumps(data)


class ConditionTreeField(serializers.Field):
    def to_representation(self, obj):
        if not obj:
            obj = '{}'

        return json.loads(obj)

    def to_internal_value(self, data):
        if not isinstance(data, dict):
            raise serializers.ValidationError('Expected dict')

        self.__validate_json(data)

        return json.dumps(data)

    def __validate_json(self, data):
        if 'node_type' not in data or not isinstance(data['node_type'], basestring):
            raise serializers.ValidationError('Missing or invalid node type')

        if data['node_type'] in ShowIf.CRITERIA_TYPES:
            if 'children' in data:
                raise serializers.ValidationError('CRITERIA node must have no children')

            if 'criteria_element' in data and not isinstance(data['criteria_element'], int):
                raise serializers.ValidationError('CRITERIA criteria_element must be an integer')

            if 'value' in data and not isinstance(data['value'], basestring):
                raise serializers.ValidationError('CRITERIA value must be a string')
        elif data['node_type'] in ShowIf.LOGICAL_TYPES:
            if 'value' in data:
                raise serializers.ValidationError('Only "CRITERIA" should have a value')

            if 'criteria_element' in data:
                raise serializers.ValidationError('Only "CRITERIA" should have an element')

            if 'children' not in data or not isinstance(data['children'], list):
                raise serializers.ValidationError('Logical nodes must have children')

            if data['node_type'] == 'NOT' and len(data['children']) != 1:
                raise serializers.ValidationError('NOT nodes must have exactly 1 child')

            if data['node_type'] in ('AND', 'OR') and len(data['children']) < 1:
                raise serializers.ValidationError('AND and OR nodes must have at least 1 child')

            for child in data['children']:
                self.__validate_json(child)

        else:
            raise serializers.ValidationError('Invalid node type "{0}"'.format(data['node_type']))
