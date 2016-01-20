from django.test import TestCase
from django.db import IntegrityError
from nose.tools import raises, assert_equals, assert_is_not_none
from api.models import Concept
from utils import factories


class ConceptTest(TestCase):
    def setUp(self):
        self.name = 'SX SITE SWELLING'
        self.display_name = 'Swelling at surgical site'

    def test_concept_required(self):
        concept = Concept.objects.create(
            name=self.name,
            display_name=self.display_name
        )

        assert_equals(len(concept.uuid.hex), 32)
        assert_equals(concept.name, self.name)
        assert_equals(concept.display_name, self.display_name)

    def test_concepts_all_properties(self):
        Concept.objects.create(
            name=self.name,
            display_name=self.display_name,
            description='Swelling observed at surgical site post procedure',
            data_type='string',
            mime_type='text/plain',
            constraint='yes;no'
        )

        concept = Concept.objects.get(name='SX SITE SWELLING')

        assert_equals(len(concept.uuid.hex), 32)
        assert_is_not_none(concept.created)
        assert_is_not_none(concept.last_modified)
        assert_equals(concept.name, self.name)
        assert_equals(concept.display_name, self.display_name)
        assert_equals(concept.description, 'Swelling observed at surgical site post procedure')
        assert_equals(concept.data_type, 'string')
        assert_equals(concept.mime_type, 'text/plain')
        assert_equals(concept.constraint, 'yes;no')

    @raises(IntegrityError)
    def test_concept_type_invalid(self):
        Concept.objects.create(
            name=self.name,
            display_name=self.display_name,
            data_type='bad'
        )

    def test_data_type_string(self):
        self.assert_data_type_valid('string')

    def test_data_type_boolean(self):
        self.assert_data_type_valid('boolean')

    def test_data_type_number(self):
        self.assert_data_type_valid('number')

    def test_data_type_complex(self):
        self.assert_data_type_valid('complex')

# HELPERS

    def assert_data_type_valid(self, data_type):
        concept = factories.ConceptFactory(
            data_type=data_type
        )

        assert_is_not_none(concept)
