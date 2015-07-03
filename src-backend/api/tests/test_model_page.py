from django.test import TestCase
from django.contrib.auth.models import User
from django.db import IntegrityError
from nose.tools import raises, assert_equals, assert_not_equals, nottest
from api.models import Procedure, Page


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

        page3 = Page.objects.create(
            display_index=0,
            procedure=self.test_procedure1
        )

        expected_pages = [page3, page2, page1]
        pages = Page.objects.all()

        for i in range(0, 3):
            assert_equals(pages[i], expected_pages[i])
            assert_equals(pages[i].display_index, i)

    def test_page_update_without_reorder(self):
        page1 = Page.objects.create(
            display_index=0,
            procedure=self.test_procedure1
        )

        page2 = Page.objects.create(
            display_index=1,
            procedure=self.test_procedure1
        )

        page3 = Page.objects.create(
            display_index=2,
            procedure=self.test_procedure1
        )

        page1.procedure = self.test_procedure2
        page1.save()

        pages = [page1, page2, page3]

        for i in range(0, 3):
            assert_equals(pages[i].display_index, i)

    def test_page_reorder_with_decrements(self):
        page1 = Page.objects.create(
            display_index=0,
            procedure=self.test_procedure1
        )

        page2 = Page.objects.create(
            display_index=1,
            procedure=self.test_procedure1
        )

        page3 = Page.objects.create(
            display_index=2,
            procedure=self.test_procedure1
        )

        page4 = Page.objects.create(
            display_index=3,
            procedure=self.test_procedure1
        )        

        page2.display_index = 2
        page2.save()
        page1.refresh_from_db()
        page2.refresh_from_db()
        page3.refresh_from_db()
        page4.refresh_from_db()

        assert_equals(page1.display_index, 0)
        assert_equals(page3.display_index, 1)
        assert_equals(page2.display_index, 2)
        assert_equals(page4.display_index, 3)
