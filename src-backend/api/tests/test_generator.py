from django.test import TestCase
from django.contrib.auth.models import User
from nose.tools import assert_equals, assert_true, assert_false
from api.models import *
from api.generator import *
import uuid


class ProcedureGeneratorTest(TestCase):
    def setUp(self):
        test_user = User.objects.create_user(
            'TestUser',
            'test@sanaprotocolbuilder.me',
            'testpassword'
        )
        test_user.save()

        self.procedure = Procedure.objects.create(
            author='tester',
            title='test procedure',
            owner=test_user
        )

        self.generator = ProcedureGenerator(self.procedure)
        self.procedureElement = self.generator.generate()
        self.attribs = self.procedureElement.attrib

    def test_element_has_correct_name(self):
        assert_equals(self.procedureElement.tag, self.generator.name)

    def test_element_has_title(self):
        assert_true('title' in self.attribs)
        assert_equals(self.attribs['title'], self.procedure.title)

    def test_element_has_author(self):
        assert_true('author' in self.attribs)
        assert_equals(self.attribs['author'], self.procedure.author)

    def test_element_has_no_version_attrib(self):
        assert_false('version' in self.attribs, self.attribs)

    def test_element_has_no_uuid(self):
        assert_false('uuid' in self.attribs)

    def test_element_has_version_attrib(self):
        self.procedure.version = "0.1"
        self.procedureElement = self.generator.generate()

        assert_true('version' in self.procedureElement.attrib)
        assert_equals(self.procedureElement.attrib['version'], self.procedure.version)

    def test_element_has_uuid_attrib(self):
        self.procedure.uuid = str(uuid.uuid1())
        self.procedureElement = self.generator.generate()

        assert_true('uuid' in self.procedureElement.attrib)
        assert_equals(self.procedureElement.attrib['uuid'], self.procedure.uuid)
