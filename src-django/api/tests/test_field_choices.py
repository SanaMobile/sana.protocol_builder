from django.test import TestCase
from nose.tools import raises, assert_equals, assert_true
from rest_framework.serializers import ValidationError
from api.field import ElementChoicesField


class ElementChoicesFieldTest(TestCase):
    def setUp(self):
        self.field = ElementChoicesField()
        self.json_string = '["test", "tester", "testing"]'
        self.string_array = ['test', 'tester', 'testing']

    def test_to_representation(self):
        result = self.field.to_representation(self.json_string)
        assert_true(isinstance(result, list))
        assert_equals(len(result), 3)
        assert_equals(result, self.string_array)

    @raises(ValidationError)
    def test_to_internal_value_fails_with_bad_list(self):
        self.field.to_internal_value('')

    @raises(ValidationError)
    def test_to_internal_value_fails_with_bad_list_content(self):
        self.field.to_internal_value([1])

    def test_to_internal_value(self):
        result = self.field.to_internal_value(self.string_array)
        assert_true(isinstance(result, basestring))
        assert_equals(result, self.json_string)
