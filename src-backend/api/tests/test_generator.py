from xml.etree import ElementTree
from django.test import TestCase
from django.contrib.auth.models import User
from nose.tools import raises, assert_equals, assert_not_equals, assert_true, assert_false
from api.models import Procedure, Page, Element
from api.generator import ProcedureGenerator, PageGenerator, ElementGenerator, ProtocolBuilder
import uuid


class ProcedureGeneratorTest(TestCase):
    def setUp(self):
        self.test_user = User.objects.create_user(
            'TestUser',
            'test@sanaprotocolbuilder.me',
            'testpassword'
        )
        self.test_user.save()

        self.procedure = Procedure.objects.create(
            author='tester',
            title='test procedure',
            owner=self.test_user
        )

        self.generator = ProcedureGenerator(self.procedure)
        self.procedure_etree_element = self.generator.generate()
        self.attribs = self.procedure_etree_element.attrib

    def test_element_has_correct_name(self):
        assert_equals(self.procedure_etree_element.tag, self.generator.name)

    def test_element_has_title(self):
        assert_true('title' in self.attribs)
        assert_equals(self.attribs['title'], self.procedure.title)

    def test_element_has_author(self):
        assert_true('author' in self.attribs)
        assert_equals(self.attribs['author'], self.procedure.author)

    @raises(ValueError)
    def test_error_if_no_title(self):
        procedure = Procedure.objects.create(
            author='author',
            owner=self.test_user
        )

        ProcedureGenerator(procedure).generate()

    @raises(ValueError)
    def test_error_if_blank_title(self):
        procedure = Procedure.objects.create(
            author='author',
            title='',
            owner=self.test_user
        )

        ProcedureGenerator(procedure).generate()

    @raises(ValueError)
    def test_error_if_no_author(self):
        procedure = Procedure.objects.create(
            title='title',
            owner=self.test_user
        )

        ProcedureGenerator(procedure).generate()

    @raises(ValueError)
    def test_error_if_blank_author(self):
        procedure = Procedure.objects.create(
            title='title',
            author='',
            owner=self.test_user
        )

        ProcedureGenerator(procedure).generate()

    def test_element_has_no_version_attrib(self):
        assert_false('version' in self.attribs, self.attribs)

    def test_element_has_no_uuid(self):
        assert_false('uuid' in self.attribs)

    def test_element_has_version_attrib(self):
        self.procedure.version = '0.1'
        self.procedure_etree_element = self.generator.generate()

        assert_true('version' in self.procedure_etree_element.attrib)
        assert_equals(self.procedure_etree_element.attrib['version'], self.procedure.version)

    def test_element_has_uuid_attrib(self):
        self.procedure.uuid = str(uuid.uuid1())
        self.procedure_etree_element = self.generator.generate()

        assert_true('uuid' in self.procedure_etree_element.attrib)
        assert_equals(self.procedure_etree_element.attrib['uuid'], self.procedure.uuid)


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

        Element.objects.create(
            display_index=0,
            eid='1',
            element_type='SELECT',
            concept='HEART SURGERY',
            question='Which valve',
            answer='',
            page=self.page
        )

        self.generator = PageGenerator(self.page)
        self.page_etree_element = self.generator.generate(ElementTree.Element('test'))

    @raises(ValueError)
    def test_error_if_no_elements(self):
        self.page.elements.all().delete()
        PageGenerator(self.page).generate(ElementTree.Element('test'))

    def test_element_has_correct_name(self):
        assert_equals(self.page_etree_element.tag, self.generator.name)

    def test_element_has_no_display_index(self):
        assert_equals(len(self.page_etree_element.attrib), 0)


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

        self.page = Page.objects.create(
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
            page=self.page
        )

        self.generator = ElementGenerator(self.element)
        self.element_etree_element = self.generator.generate(ElementTree.Element('test'))
        self.attribs = self.element_etree_element.attrib

    def test_element_has_correct_name(self):
        assert_equals(self.element_etree_element.tag, self.generator.name)

    def test_element_has_no_display_index(self):
        assert_false('display_index' in self.attribs)

    def test_element_has_id(self):
        assert_true('id' in self.attribs)
        assert_equals(self.attribs['id'], self.element.eid)

    @raises(ValueError)
    def test_error_if_no_id(self):
        element = Element.objects.create(
            display_index=0,
            element_type='SELECT',
            concept='HEART SURGERY',
            question='Which valve',
            answer='',
            page=self.page
        )

        ElementGenerator(element).generate(ElementTree.Element('test'))

    @raises(ValueError)
    def test_error_if_blank_id(self):
        element = Element.objects.create(
            display_index=0,
            eid='',
            element_type='SELECT',
            concept='HEART SURGERY',
            question='Which valve',
            answer='',
            page=self.page
        )

        ElementGenerator(element).generate(ElementTree.Element('test'))

    def test_element_has_type(self):
        assert_true('type' in self.attribs)
        assert_equals(self.attribs['type'], self.element.element_type)

    @raises(ValueError)
    def test_error_if_no_type(self):
        element = Element.objects.create(
            display_index=0,
            eid='id',
            concept='HEART SURGERY',
            question='Which valve',
            answer='',
            page=self.page
        )

        ElementGenerator(element).generate(ElementTree.Element('test'))

    @raises(ValueError)
    def test_error_if_blank_type(self):
        element = Element.objects.create(
            display_index=0,
            eid='id',
            element_type='',
            concept='HEART SURGERY',
            question='Which valve',
            answer='',
            page=self.page
        )

        ElementGenerator(element).generate(ElementTree.Element('test'))

    def test_element_has_concept(self):
        assert_true('concept' in self.attribs)
        assert_equals(self.attribs['concept'], self.element.concept)

    @raises(ValueError)
    def test_error_if_no_concept(self):
        element = Element.objects.create(
            display_index=0,
            eid='id',
            element_type='SELECT',
            question='Which valve',
            answer='',
            page=self.page
        )

        ElementGenerator(element).generate(ElementTree.Element('test'))

    @raises(ValueError)
    def test_error_if_blank_concept(self):
        element = Element.objects.create(
            display_index=0,
            eid='id',
            element_type='SELECT',
            concept='',
            question='Which valve',
            answer='',
            page=self.page
        )

        ElementGenerator(element).generate(ElementTree.Element('test'))

    def test_element_has_question(self):
        assert_true('question' in self.attribs)
        assert_equals(self.attribs['question'], self.element.question)

    @raises(ValueError)
    def test_error_if_no_question(self):
        element = Element.objects.create(
            display_index=0,
            eid='id',
            element_type='SELECT',
            concept='HEART SURGERY',
            answer='',
            page=self.page
        )

        ElementGenerator(element).generate(ElementTree.Element('test'))

    @raises(ValueError)
    def test_error_if_blank_question(self):
        element = Element.objects.create(
            display_index=0,
            eid='id',
            element_type='SELECT',
            concept='HEART SURGERY',
            question='',
            answer='',
            page=self.page
        )

        ElementGenerator(element).generate(ElementTree.Element('test'))

    def test_element_has_answer(self):
        assert_true('answer' in self.attribs)
        assert_equals(self.attribs['answer'], self.element.answer)

    @raises(ValueError)
    def test_error_if_no_answer(self):
        element = Element.objects.create(
            display_index=0,
            element_type='SELECT',
            concept='HEART SURGERY',
            question='Which valve',
            eid='id',
            page=self.page
        )

        ElementGenerator(element).generate(ElementTree.Element('test'))

    def test_element_has_no_numeric(self):
        assert_false('numeric' in self.attribs)

    def test_element_has_no_choices(self):
        assert_false('choices' in self.attribs)

    def test_element_has_numeric(self):
        self.element.numeric = 'DIALPAD'
        self.element_etree_element = self.generator.generate(ElementTree.Element('test'))

        print self.element_etree_element.attrib

        assert_true('numeric' in self.element_etree_element.attrib)
        assert_equals(self.element_etree_element.attrib['numeric'], self.element.numeric)

    def test_element_has_choices(self):
        self.element.choices = '["left","right","center"]'
        self.element_etree_element = self.generator.generate(ElementTree.Element('test'))

        assert_true('choices' in self.element_etree_element.attrib)
        assert_equals(self.element_etree_element.attrib['choices'], 'left,right,center')


class ProtocolBuilderTestCase(TestCase):
    def setUp(self):
        self.test_user = User.objects.create_user(
            'TestUser',
            'test@sanaprotocolbuilder.me',
            'testpassword'
        )
        self.test_user.save()

        self.procedure = Procedure.objects.create(
            author='TestUser',
            title='Burns',
            owner=self.test_user
        )

        page1 = Page.objects.create(
            display_index=0,
            procedure=self.procedure
        )
        page2 = Page.objects.create(
            display_index=1,
            procedure=self.procedure
        )
        page3 = Page.objects.create(
            display_index=2,
            procedure=self.procedure
        )
        page4 = Page.objects.create(
            display_index=3,
            procedure=self.procedure
        )

        Element.objects.create(
            display_index=0,
            eid='burns',
            element_type='MULTI_SELECT',
            concept='BURNS',
            question='Select One or More of the Following:',
            answer='',
            choices='["On the head","On the chest","Loins","Inhalation burns","Chemical","In an enclosure","Patient Unconscious","Epileptic Patient","Diabetic Patient"]',  # noqa
            page=page1
        )

        Element.objects.create(
            display_index=1,
            eid='duration',
            element_type='ENTRY',
            concept='COMPLAINT DURATION',
            question='Enter Complaint Duration in Days:',
            answer='',
            numeric='DIALPAD',
            page=page2
        )

        Element.objects.create(
            display_index=2,
            eid='COMMENTS',
            element_type='ENTRY',
            concept='BURNS',
            question='Other comments:',
            answer='',
            page=page3
        )

        Element.objects.create(
            display_index=3,
            eid='picture',
            element_type='PICTURE',
            concept='COMPLAINT PICTURE',
            question='Add a Picture:',
            answer='',
            page=page4
        )

        self.procedure.save()

    def test_generates_tree(self):
        tree = ProtocolBuilder.generate_etree(self.test_user, self.procedure.id)

        assert_equals(len(tree), 4)

        for child in tree:
            assert_equals(len(child), 1)

    def test_generates_string_output(self):
        protocol = ProtocolBuilder.generate(self.test_user, self.procedure.id)
        assert_not_equals(protocol, None)

    @raises(ValueError)
    def test_invalid_owner(self):
        bad_user = User.objects.create_user(
            'A Bad user',
            'bad@sanaprotocolbuilder.me',
            'bad'
        )

        ProtocolBuilder.generate(bad_user, self.procedure.id)

    @raises(ValueError)
    def test_procedure_does_not_exist(self):
        ProtocolBuilder.generate(self.test_user, -1)
