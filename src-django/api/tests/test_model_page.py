from django.test import TestCase
from django.db import IntegrityError
from nose.tools import raises, assert_equals, assert_not_equals, assert_true, nottest
from api.models import Page
from utils import factories


class PageTest(TestCase):
    def test_create_page(self):
        test_procedure = factories.ProcedureFactory()

        page = factories.PageFactory(
            display_index=0,
            procedure=test_procedure
        )

        assert_equals(page.display_index, 0)
        assert_equals(page.procedure, test_procedure)
        assert_not_equals(page.last_modified, None)
        assert_not_equals(page.created, None)

    @raises(IntegrityError)
    def test_display_index_none(self):
        Page.objects.create(
            display_index=None,
            procedure=factories.ProcedureFactory()
        )

    @raises(IntegrityError)
    def test_display_index_negative(self):
        Page.objects.create(
            display_index=-1,
            procedure=factories.ProcedureFactory()
        )

    @raises(ValueError)
    def test_procedure_none(self):
        Page.objects.create(
            display_index=0,
            procedure=None
        )

    @nottest
    @raises(IntegrityError)
    def test_display_index_uniqueness(self):
        factories.PageFactory(
            display_index=0
        )
        factories.PageFactory(
            display_index=0
        )

    def test_updates_last_modified(self):
        page = factories.PageFactory()
        original_last_modified = page.last_modified

        factories.ElementFactory(
            page=page
        )

        assert_true(original_last_modified < page.last_modified)

    def test_orders_properly(self):
        procedure = factories.ProcedureFactory()

        page1 = factories.PageFactory(
            display_index=1,
            procedure=procedure
        )

        page2 = factories.PageFactory(
            display_index=0,
            procedure=procedure
        )

        pages = Page.objects.all()

        assert_equals(len(pages), 2)
        assert_equals(pages[0], page2)
        assert_equals(pages[1], page1)
