from django.test import TestCase
from django.db import IntegrityError
from nose.tools import raises, assert_equals, assert_not_equals
from api.models import Element
from utils import factories


class ElementTest(TestCase):
    def test_elements_required(self):
        page = factories.PageFactory()
        element = Element.objects.create(
            display_index=0,
            page=page
        )

        assert_equals(element.display_index, 0)
        assert_equals(element.page, page)

    def test_elements_all_properties(self):
        page = factories.PageFactory()
        Element.objects.create(
            display_index=0,
            eid='eid',
            element_type='SELECT',
            choices='[one]',
            numeric='DIALPAD',
            concept='TESTCONCEPT',
            question='test question',
            answer='',
            page=page
        )

        element = Element.objects.get(concept='TESTCONCEPT')

        assert_equals(element.display_index, 0)
        assert_equals(element.eid, 'eid')
        assert_equals(element.element_type, 'SELECT')
        assert_equals(element.choices, '[one]')
        assert_equals(element.numeric, 'DIALPAD')
        assert_equals(element.concept, 'TESTCONCEPT')
        assert_equals(element.question, 'test question')
        assert_equals(element.answer, '')
        assert_equals(element.page, page)
        assert_not_equals(element.last_modified, None)
        assert_not_equals(element.created, None)

    @raises(IntegrityError)
    def test_display_index_negative(self):
        Element.objects.create(
            display_index=-1,
            page=factories.PageFactory()
        )

    @raises(IntegrityError)
    def test_element_type_invalid(self):
        Element.objects.create(
            display_index=0,
            page=factories.PageFactory(),
            element_type='BAD'
        )

    def test_element_type_select(self):
        self.assert_element_type_valid('SELECT')

    def test_element_type_multi_select(self):
        self.assert_element_type_valid('MULTI_SELECT')

    def test_element_type_radio(self):
        self.assert_element_type_valid('RADIO')

    def test_element_type_gps(self):
        self.assert_element_type_valid('SOUND')

    def test_element_type_sound(self):
        self.assert_element_type_valid('SOUND')

    def test_element_type_picture(self):
        self.assert_element_type_valid('PICTURE')

    def test_element_type_entry(self):
        self.assert_element_type_valid('ENTRY')

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

    def assert_element_type_valid(self, element_type):
        element = factories.ElementFactory(
            element_type=element_type
        )

        assert_not_equals(element, None)
