from django.test import TestCase
from django.db import IntegrityError
from nose.tools import raises, assert_equals, assert_true, assert_is_not_none
from api.models import Element
from utils import factories


class ElementTest(TestCase):
    def test_elements_required(self):
        page = factories.PageFactory()
        concept = factories.ConceptFactory()
        element = Element.objects.create(
            display_index=0,
            page=page,
            element_type='ENTRY',
            answer='',
            question='What does the fox say?',
            concept=concept
        )

        assert_equals(element.display_index, 0)
        assert_equals(element.page, page)
        assert_equals(element.element_type, 'ENTRY')
        assert_equals(element.answer, '')
        assert_equals(element.question, 'What does the fox say?')
        assert_equals(element.concept, concept)
        assert_equals(element.required, False)

    def test_elements_all_select_properties(self):
        page = factories.PageFactory()
        concept = factories.ConceptFactory()
        Element.objects.create(
            display_index=0,
            element_type='SELECT',
            choices='[one, two, three]',
            concept=concept,
            question='test question',
            answer='',
            required=True,
            image='test',
            audio='ping',
            page=page
        )

        element = Element.objects.get(concept=concept)

        assert_equals(element.display_index, 0)
        assert_equals(element.element_type, 'SELECT')
        assert_equals(element.choices, '[one, two, three]')
        assert_equals(element.concept, concept)
        assert_equals(element.question, 'test question')
        assert_equals(element.answer, '')
        assert_equals(element.page, page)
        assert_true(element.required)
        assert_equals(element.image, 'test')
        assert_equals(element.audio, 'ping')
        assert_is_not_none(element.last_modified, None)
        assert_is_not_none(element.created, None)

    def test_elements_all_plugin_properties(self):
        page = factories.PageFactory()
        concept = factories.ConceptFactory()
        Element.objects.create(
            display_index=0,
            element_type='PLUGIN',
            concept=concept,
            question='test question',
            answer='',
            required=True,
            image='test',
            audio='ping',
            action='action',
            mime_type='text/javascript',
            page=page
        )

        element = Element.objects.get(concept=concept)

        assert_equals(element.display_index, 0)
        assert_equals(element.element_type, 'PLUGIN')
        assert_equals(element.concept, concept)
        assert_equals(element.question, 'test question')
        assert_equals(element.answer, '')
        assert_equals(element.page, page)
        assert_true(element.required)
        assert_equals(element.image, 'test')
        assert_equals(element.audio, 'ping')
        assert_equals(element.action, 'action')
        assert_equals(element.mime_type, 'text/javascript')
        assert_is_not_none(element.last_modified, None)
        assert_is_not_none(element.created, None)

    @raises(IntegrityError)
    def test_display_index_negative(self):
        factories.ElementFactory(
            display_index=-1
        )

    @raises(IntegrityError)
    def test_element_type_invalid(self):
        factories.ElementFactory(
            element_type='BAD'
        )

    def test_element_type_select(self):
        self.assert_choice_element_type_valid('SELECT')

    def test_element_type_multi_select(self):
        self.assert_choice_element_type_valid('MULTI_SELECT')

    def test_element_type_radio(self):
        self.assert_choice_element_type_valid('RADIO')

    def test_element_type_plugin(self):
        self.assert_plugin_element_type_valid('PLUGIN')

    def test_element_type_entry_plugin(self):
        self.assert_plugin_element_type_valid('ENTRY_PLUGIN')

    def test_element_type_picture(self):
        self.assert_element_type_valid('PICTURE')

    def test_element_type_entry(self):
        self.assert_element_type_valid('ENTRY')

    def test_element_type_date(self):
        self.assert_element_type_valid('DATE')

    def test_orders_properly(self):
        page = factories.PageFactory()

        element1 = factories.ElementFactory(
            display_index=1,
            page=page
        )

        element2 = factories.ElementFactory(
            display_index=0,
            page=page
        )

        elements = Element.objects.all()

        assert_equals(len(elements), 2)
        assert_equals(elements[0], element2)
        assert_equals(elements[1], element1)

# HELPERS

    def create_empty_choice_element(self, element_type):
        factories.ChoiceElementFactory(
            element_type=element_type,
            choices=None
        )

    def assert_choice_element_type_valid(self, element_type):
        element = factories.ChoiceElementFactory(
            element_type=element_type
        )

        assert_is_not_none(element)

    def assert_plugin_element_type_valid(self, element_type):
        element = factories.PluginElementFactory(
            element_type=element_type
        )

        assert_is_not_none(element)

    def assert_element_type_valid(self, element_type):
        element = factories.ElementFactory(
            element_type=element_type
        )

        assert_is_not_none(element)
