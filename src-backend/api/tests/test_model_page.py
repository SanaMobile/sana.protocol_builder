from django.test import TestCase
from django.contrib.auth.models import User
from django.db import IntegrityError
from nose.tools import raises, assert_equals, assert_not_equals, nottest
from api.models import Procedure, Page
from api.signals import page_pre_save  # noqa


class ProcedureTest(TestCase):
    def setUp(self):
        self.test_user = User.objects.create_user(
            'TestUser',
            'test@sanaprotocolbuilder.me',
            'testpassword'
        )
        self.test_user.save()

        self.test_procedure1 = Procedure.objects.create(
            author='tester',
            title='test procedure 1',
            owner=self.test_user
        )
        self.test_procedure1.save()

        self.test_procedure2 = Procedure.objects.create(
            author='tester',
            title='test procedure 2',
            owner=self.test_user
        )
        self.test_procedure2.save()

    def test_create_page(self):
        page = Page.objects.create(
            display_index=0,
            procedure=self.test_procedure1
        )

        assert_equals(page.display_index, 0)
        assert_equals(page.procedure, self.test_procedure1)
        assert_not_equals(page.last_modified, None)
        assert_not_equals(page.created, None)

    @raises(IntegrityError)
    def test_display_index_none(self):
        Page.objects.create(
            display_index=None,
            procedure=self.test_procedure1
        )

    @raises(IntegrityError)
    def test_procedure_none(self):
        Page.objects.create(
            display_index=0
        )

    @nottest
    @raises(IntegrityError)
    def test_display_index_uniqueness(self):
        Page.objects.create(
            display_index=0,
            procedure=self.test_procedure1
        )

        Page.objects.create(
            display_index=0,
            procedure=self.test_procedure1
        )

    def test_page_ordering(self):
        page1 = Page.objects.create(
            display_index=0,
            procedure=self.test_procedure1
        )
        page2 = Page.objects.create(
            display_index=1,
            procedure=self.test_procedure1
        )
        page3 = Page.objects.create(
            display_index=0,
            procedure=self.test_procedure2
        )
        page4 = Page.objects.create(
            display_index=1,
            procedure=self.test_procedure2
        )

        pages = Page.objects.all()
        expected_pages = [page1, page2, page3, page4]

        for i in range(0, 4):
            assert_equals(pages[i], expected_pages[i])

    def test_page_reordering(self):
        page1 = Page.objects.create(
            display_index=0,
            procedure=self.test_procedure1
        )

        page2 = Page.objects.create(
            display_index=0,
            procedure=self.test_procedure1
        )

        expected_pages = [page2, page1]
        pages = Page.objects.all()

        for i in range(0, 2):
            assert_equals(pages[i], expected_pages[i])
