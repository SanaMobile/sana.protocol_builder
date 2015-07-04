from rest_framework import serializers
import json


class ElementChoicesField(serializers.Field):
    def to_representation(self, obj):
        return json.loads(obj)

    def to_internal_value(self, data):
        if not isinstance(data, list):
            raise serializers.ValidationError('Expected list')

        if not all(isinstance(item, basestring) for item in data):
            raise serializers.ValidationError('All choices should be strings')

        return json.dumps(data)
