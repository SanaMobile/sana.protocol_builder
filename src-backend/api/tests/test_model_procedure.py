from django.test import TestCase
from django.contrib.auth.models import User
from django.db import IntegrityError
from nose.tools import raises, assert_equals
from api.models import Procedure
import uuid


class ProcedureTest(TestCase):
    def setUp(self):
        self.test_user = User.objects.create_user(
            'TestUser',
            'test@sanaprotocolbuilder.me',
            'testpassword'
        )
        self.test_user.save()

    def test_procedures_required(self):
        Procedure.objects.create(
            author='tester',
            title='test procedure',
            owner=self.test_user
        )

        proc = Procedure.objects.get(author='tester')
        assert_equals(proc.author, 'tester')
        assert_equals(proc.title, 'test procedure')
        assert_equals(proc.version, None)
        assert_equals(proc.uuid, None)
        assert_equals(proc.owner, self.test_user)

    def test_procedures_all_properties(self):
        test_uuid = str(uuid.uuid1())

        Procedure.objects.create(
            author='tester2',
            title='full test procedure',
            version='1.0',
            uuid=test_uuid,
            owner=self.test_user
        )

        proc = Procedure.objects.get(author='tester2')
        assert_equals(proc.author, 'tester2')
        assert_equals(proc.title, 'full test procedure')
        assert_equals(proc.version, '1.0')
        assert_equals(proc.uuid, test_uuid)
        assert_equals(proc.owner, self.test_user)

    @raises(IntegrityError)
    def test_author_none(self):
        Procedure.objects.create(
            author=None,
            title='full test procedure',
            owner=self.test_user
        )

    @raises(IntegrityError)
    def test_title_none(self):
        Procedure.objects.create(
            author='author',
            title=None,
            owner=self.test_user
        )

    @raises(IntegrityError)
    def test_owner_none(self):
        Procedure.objects.create(
            author='author',
            title=None
        )
