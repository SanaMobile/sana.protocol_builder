from xml.etree import ElementTree
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


class PageGeneratorTest(TestCase):
    def setUp(self):
        test_user = User.objects.create_user(
            'TestUser',
            'test@sanaprotocolbuilder.me',
            'testpassword'
        )
        test_user.save()

        procedure = Procedure.objects.create(
            author='tester',
            title='test procedure',
            owner=test_user
        )

        self.page = Page.objects.create(
            display_index=0,
            procedure=procedure
        )

        self.generator = PageGenerator(self.page)
        self.pageElement = self.generator.generate(ElementTree.Element('test'))

    def test_element_has_correct_name(self):
        assert_equals(self.pageElement.tag, self.generator.name)

    def test_element_has_no_display_index(self):
        assert_equals(len(self.pageElement.attrib), 0)


class ElementGeneratorTest(TestCase):
    def setUp(self):
        test_user = User.objects.create_user(
            'TestUser',
            'test@sanaprotocolbuilder.me',
            'testpassword'
        )
        test_user.save()

        procedure = Procedure.objects.create(
            author='tester',
            title='test procedure',
            owner=test_user
        )

        page = Page.objects.create(
            display_index=0,
            procedure=procedure
        )

        self.element = Element.objects.create(
            display_index=0,
            eid='1',
            element_type='SELECT',
            concept='HEART SURGERY',
            question='Which valve',
            answer='',
            page=page
        )

        self.generator = ElementGenerator(self.element)
        self.elementElement = self.generator.generate(ElementTree.Element('test'))
        self.attribs = self.elementElement.attrib

    def test_element_has_correct_name(self):
        assert_equals(self.elementElement.tag, self.generator.name)

    def test_element_has_no_display_index(self):
        assert_false('display_index' in self.attribs)

    def test_element_has_id(self):
        assert_true('id' in self.attribs)
        assert_equals(self.attribs['id'], self.element.eid)

    def test_element_has_type(self):
        assert_true('type' in self.attribs)
        assert_equals(self.attribs['type'], self.element.element_type)

    def test_element_has_concept(self):
        assert_true('concept' in self.attribs)
        assert_equals(self.attribs['concept'], self.element.concept)

    def test_element_has_question(self):
        assert_true('question' in self.attribs)
        assert_equals(self.attribs['question'], self.element.question)

    def test_element_has_answer(self):
        assert_true('answer' in self.attribs)
        assert_equals(self.attribs['answer'], self.element.answer)

    def test_element_has_no_numeric(self):
        assert_false('numeric' in self.attribs)

    def test_element_has_no_choices(self):
        assert_false('choices' in self.attribs)

    def test_element_has_numeric(self):
        self.element.numeric = 'DIALPAD'
        self.elementElement = self.generator.generate(ElementTree.Element('test'))

        print self.elementElement.attrib

        assert_true('numeric' in self.elementElement.attrib)
        assert_equals(self.elementElement.attrib['numeric'], self.element.numeric)

    def test_element_has_choices(self):
        self.element.choices = 'left,right,center'
        self.elementElement = self.generator.generate(ElementTree.Element('test'))

        assert_true('choices' in self.elementElement.attrib)
        assert_equals(self.elementElement.attrib['choices'], self.element.choices)
