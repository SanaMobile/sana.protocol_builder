from django.test import TestCase
from django.contrib.auth.models import User
from django.db import IntegrityError
from nose.tools import raises, assert_equals, assert_not_equals, nottest
from api.models import Procedure, Page
from utils import factories


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

    def test_updates_last_modified(self):
        page = factories.PageFactory()
        original_last_modified = page.last_modified

        factories.ElementFactory(
            page=page
        )

        assert_not_equals(original_last_modified, page.last_modified)
