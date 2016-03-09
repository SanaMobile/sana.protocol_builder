from django.test import TestCase
from django.db import IntegrityError
from nose.tools import raises, assert_equals, assert_true, assert_is_not_none, assert_raises
from api.models import Procedure, Page, Element, ShowIf
from utils import factories


class ProcedureTest(TestCase):
    def test_procedures_required(self):
        test_user = factories.UserFactory()

        Procedure.objects.create(
            author='tester',
            title='test procedure',
            owner=test_user
        )

        proc = Procedure.objects.get(author='tester')
        assert_equals(proc.author, 'tester')
        assert_equals(proc.title, 'test procedure')
        assert_is_not_none(proc.uuid)
        assert_equals(proc.owner, test_user)

    @raises(IntegrityError)
    def test_author_none(self):
        Procedure.objects.create(
            author=None,
            title='test procedure',
            owner=factories.UserFactory()
        )

    @raises(IntegrityError)
    def test_title_none(self):
        Procedure.objects.create(
            author='tester',
            title=None,
            owner=factories.UserFactory()
        )

    @raises(ValueError)
    def test_owner_none(self):
        Procedure.objects.create(
            author='tester',
            title='test procedure',
            owner=None
        )

    def test_page_update_updates_last_modified(self):
        procedure = factories.ProcedureFactory()
        original_last_modified = procedure.last_modified

        factories.PageFactory(
            procedure=procedure
        )

        assert_true(original_last_modified < procedure.last_modified)

    def test_element_update_updates_last_modified(self):
        page = factories.PageFactory()
        procedure = page.procedure

        original_last_modified = procedure.last_modified

        factories.ElementFactory(
            page=page
        )

        assert_true(original_last_modified < procedure.last_modified)

    def test_cascade_delete(self):
        procedure = factories.ProcedureFactory()
        page = factories.PageFactory(
            procedure=procedure
        )
        element = factories.ElementFactory(
            page=page
        )
        show_if = factories.ShowIfFactory(
            page=page
        )

        procedure.delete()

        with assert_raises(Procedure.DoesNotExist):
            Procedure.objects.get(pk=procedure.pk)

        with assert_raises(Page.DoesNotExist):
            Page.objects.get(pk=page.pk)

        with assert_raises(Element.DoesNotExist):
            Element.objects.get(pk=element.pk)

        with assert_raises(ShowIf.DoesNotExist):
            ShowIf.objects.get(pk=show_if.pk)
