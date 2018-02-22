from xml.etree import ElementTree
from django.test import TestCase
from nose.tools import raises, assert_equals, assert_is_not_none, assert_true, assert_false, assert_is_none, assert_in
from api.models import Element
import api.generator as generators
from utils import factories
import json


class ProcedureGeneratorTest(TestCase):
    def setUp(self):
        self.procedure = factories.ProcedureFactory(
            author='tester',
            title='test procedure'
        )

        self.generator = generators.ProcedureGenerator(self.procedure)
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
        procedure = factories.ProcedureFactory()
        procedure.title = None

        generators.ProcedureGenerator(procedure).generate()

    @raises(ValueError)
    def test_error_if_blank_title(self):
        procedure = factories.ProcedureFactory(
            title=''
        )

        generators.ProcedureGenerator(procedure).generate()

    @raises(ValueError)
    def test_error_if_no_author(self):
        procedure = factories.ProcedureFactory()
        procedure.author = None

        generators.ProcedureGenerator(procedure).generate()

    @raises(ValueError)
    def test_error_if_blank_author(self):
        procedure = factories.ProcedureFactory(
            author=''
        )

        generators.ProcedureGenerator(procedure).generate()

    def test_element_has_version_attrib(self):
        assert_true('version' in self.procedure_etree_element.attrib)
        assert_equals(self.procedure_etree_element.attrib['version'], str(self.procedure.last_modified))

    def test_element_has_uuid_attrib(self):
        assert_true('uuid' in self.procedure_etree_element.attrib)
        assert_equals(self.procedure_etree_element.attrib['uuid'], str(self.procedure.uuid))


class PageGeneratorTest(TestCase):
    def setUp(self):
        self.page = factories.PageFactory(
            display_index=0
        )

        factories.ElementFactory(
            page=self.page
        )

        self.generator = generators.PageGenerator(self.page)
        self.page_etree_element = self.generator.generate(ElementTree.Element('test'))

    @raises(ValueError)
    def test_error_if_no_elements(self):
        self.page.elements.all().delete()
        generators.PageGenerator(self.page).generate(ElementTree.Element('test'))

    def test_element_has_correct_name(self):
        assert_equals(self.page_etree_element.tag, self.generator.name)

    def test_element_has_no_display_index(self):
        assert_equals(len(self.page_etree_element.attrib), 0)


class ElementGeneratorTest(TestCase):
    def setUp(self):
        self.element = factories.ElementFactory(
            display_index=0,
            element_type='ENTRY',
            question='Which valve',
            answer='[]'
        )

        self.generator = generators.ElementGenerator(self.element)
        self.element_etree_element = self.generator.generate(ElementTree.Element('test'))
        self.attribs = self.element_etree_element.attrib

    def test_element_has_correct_name(self):
        assert_equals(self.element_etree_element.tag, self.generator.name)

    def test_element_has_no_display_index(self):
        assert_false('display_index' in self.attribs)

    def test_element_has_id(self):
        assert_true('id' in self.attribs)
        assert_equals(self.attribs['id'], str(self.element.pk))

    def test_element_has_type(self):
        assert_true('type' in self.attribs)
        assert_equals(self.attribs['type'], self.element.element_type)

    def test_element_has_concept(self):
        assert_true('concept' in self.attribs)
        assert_equals(self.attribs['concept'], self.element.concept.name)

    @raises(ValueError)
    def test_error_if_no_concept(self):
        element = factories.ElementFactory(
            concept=None
        )

        generators.ElementGenerator(element).generate(ElementTree.Element('test'))

    def test_element_has_question(self):
        assert_true('question' in self.attribs)
        assert_equals(self.attribs['question'], self.element.question)

    @raises(ValueError)
    def test_error_if_no_question(self):
        element = factories.ElementFactory(
            question=None
        )

        generators.ElementGenerator(element).generate(ElementTree.Element('test'))

    @raises(ValueError)
    def test_error_if_blank_question(self):
        element = factories.ElementFactory(
            question=''
        )

        generators.ElementGenerator(element).generate(ElementTree.Element('test'))

    def test_element_has_answer(self):
        assert_true('answer' in self.attribs)
        assert_equals(self.attribs['answer'], '')

    @raises(ValueError)
    def test_error_if_no_answer(self):
        element = factories.ElementFactory(
            answer=None
        )

        generators.ElementGenerator(element).generate(ElementTree.Element('test'))

    @raises(ValueError)
    def test_error_if_no_choices(self):
        element = factories.ChoiceElementFactory(
            choices=[]
        )

        generators.ElementGenerator(element).generate(ElementTree.Element('test'))

    @raises(ValueError)
    def test_error_if_no_action(self):
        element = factories.PluginElementFactory(
            action=None
        )

        generators.ElementGenerator(element).generate(ElementTree.Element('test'))

    @raises(ValueError)
    def test_error_if_no_mime_type(self):
        element = factories.PluginElementFactory(
            mime_type=None
        )

        generators.ElementGenerator(element).generate(ElementTree.Element('test'))

    def test_element_has_no_choices(self):
        assert_false('choices' in self.attribs)

    def test_element_has_choices(self):
        self.element.choices = '["left","right","center,"]'
        self.element.element_type = 'SELECT'
        self.element_etree_element = self.generator.generate(ElementTree.Element('test'))

        assert_true('choices' in self.element_etree_element.attrib)
        assert_equals(self.element_etree_element.attrib['choices'], 'left,right,center&semi&')

    def test_element_has_no_required(self):
        assert_false('required' in self.attribs)

    def test_element_has_required(self):
        self.element.required = True
        self.element_etree_element = self.generator.generate(ElementTree.Element('test'))

        assert_true('required' in self.element_etree_element.attrib)
        assert_equals(self.element_etree_element.attrib['required'], 'true')

    def test_element_has_no_image(self):
        assert_false('image' in self.attribs)

    def test_element_has_image(self):
        self.element.image = 'image'
        self.element_etree_element = self.generator.generate(ElementTree.Element('test'))

        assert_true('image' in self.element_etree_element.attrib)
        assert_equals(self.element_etree_element.attrib['image'], 'image')

    def test_element_has_no_audio(self):
        assert_false('audio' in self.attribs)

    def test_element_has_audio(self):
        self.element.audio = 'audio'
        self.element_etree_element = self.generator.generate(ElementTree.Element('test'))

        assert_true('audio' in self.element_etree_element.attrib)
        assert_equals(self.element_etree_element.attrib['audio'], 'audio')

    def test_element_has_no_plugin_attributes(self):
        assert_false('action' in self.attribs)
        assert_false('mime_type' in self.attribs)

    def test_element_has_plugin_attributes(self):
        self.element.action = 'action'
        self.element.mime_type = 'mime_type'
        self.element.element_type = 'PLUGIN'
        self.element_etree_element = self.generator.generate(ElementTree.Element('test'))

        assert_true('action' in self.element_etree_element.attrib)
        assert_equals(self.element_etree_element.attrib['action'], 'action')

        assert_true('mime_type' in self.element_etree_element.attrib)
        assert_equals(self.element_etree_element.attrib['mime_type'], 'mime_type')


class ShowIfGeneratorTest(TestCase):
    def setUp(self):
        self.show_if = factories.ShowIfFactory(conditions=json.dumps({
            'node_type': 'NOT',
            'children': [
                {
                    'node_type': 'AND',
                    'children': [
                        {
                            'criteria_element': factories.ElementFactory().pk,
                            'node_type': 'EQUALS',
                            'value': 'foo'
                        },
                        {
                            'criteria_element': factories.ElementFactory().pk,
                            'node_type': 'LESS',
                            'value': 'bar'
                        },
                        {
                            'node_type': 'AND',
                            'children': [
                                {
                                    'criteria_element': factories.ElementFactory().pk,
                                    'node_type': 'GREATER',
                                    'value': 'bar'
                                }
                            ]
                        }
                    ]
                }
            ]
        }))

        self.generator = generators.ShowIfGenerator(self.show_if)
        self.show_if_etree_element = self.generator.generate_show_if(ElementTree.Element('test'))

    @raises(ValueError)
    def test_error_if_no_conditions(self):
        self.show_if.conditions = None
        generators.ShowIfGenerator(self.show_if).generate(ElementTree.Element('test'))

    def test_element_has_correct_name(self):
        assert_equals(self.show_if_etree_element.tag, self.generator.name)

    def test_full_generate(self):
        assert_is_not_none(self.show_if_etree_element)


class ConditionNodeGeneratorTest(TestCase):
    def setUp(self):
        self.conditions = {
            'node_type': 'NOT',
            'children': [
                {
                    'node_type': 'AND',
                    'children': [
                        {
                            'criteria_element': factories.ElementFactory().pk,
                            'node_type': 'EQUALS',
                            'value': 'foo'
                        },
                        {
                            'criteria_element': factories.ElementFactory().pk,
                            'node_type': 'LESS',
                            'value': 'bar'
                        },
                        {
                            'node_type': 'AND',
                            'children': [
                                {
                                    'criteria_element': factories.ElementFactory().pk,
                                    'node_type': 'GREATER',
                                    'value': 'bar'
                                }
                            ]
                        }
                    ]
                }
            ]
        }

        self.generator = generators.ConditionNodeGenerator(self.conditions, factories.ShowIfFactory())
        self.node_etree_element = self.generator.generate(ElementTree.Element('test'))

    def test_generates(self):
        assert_is_not_none(self.node_etree_element)


class LogicalNodeGeneratorTest(TestCase):
    def setUp(self):
        self.page = factories.PageFactory()

    @raises(ValueError)
    def test_error_if_wrong_type(self):
        data = {
            'criteria_element': factories.ElementFactory().pk,
            'node_type': 'GREATER',
            'value': 'bar'
        }
        generators.LogicalNodeGenerator(data, self.page).generate(ElementTree.Element('test'))

    def test_generates_no_node(self):
        data = {
            'node_type': 'AND',
            'children': [
                {
                    'criteria_element': factories.ElementFactory().pk,
                    'node_type': 'GREATER',
                    'value': 'bar'
                }
            ]
        }

        generator = generators.LogicalNodeGenerator(data, factories.PageFactory())
        assert_is_none(generator.get_etree_node(ElementTree.Element('test')), None)

    def test_generates_not_node(self):
        data = {
            'node_type': 'NOT',
            'children': [
                {
                    'criteria_element': factories.ElementFactory().pk,
                    'node_type': 'GREATER',
                    'value': 'bar'
                }
            ]
        }

        generator = generators.LogicalNodeGenerator(data, factories.PageFactory())
        assert_is_not_none(generator.get_etree_node(ElementTree.Element('test')))

    def test_generates_and_or_node(self):
        data = {
            'node_type': 'AND',
            'children': [
                {
                    'criteria_element': factories.ElementFactory().pk,
                    'node_type': 'GREATER',
                    'value': 'bar'
                },
                {
                    'criteria_element': factories.ElementFactory().pk,
                    'node_type': 'GREATER',
                    'value': 'bar'
                }
            ]
        }

        generator = generators.LogicalNodeGenerator(data, factories.PageFactory())
        assert_is_not_none(generator.get_etree_node(ElementTree.Element('test')))

    def test_has_correct_name(self):
        generator = generators.LogicalNodeGenerator({
            'node_type': 'NOT',
            'children': [
                {
                    'criteria_element': factories.ElementFactory().pk,
                    'node_type': 'GREATER',
                    'value': 'bar'
                }
            ]
        }, factories.PageFactory())
        assert_equals(generator.name, 'not')


class CriteriaNodeGeneratorTest(TestCase):
    def setUp(self):
        self.element = factories.ElementFactory()
        self.data = {
            'criteria_element': self.element.pk,
            'node_type': 'GREATER',
            'value': 'bar'
        }

    @raises(ValueError)
    def test_error_if_wrong_type(self):
        self.data['node_type'] = 'AND'
        generators.CriteriaNodeGenerator(self.data, factories.PageFactory()).generate(ElementTree.Element('test'))

    @raises(ValueError)
    def test_error_if_no_value(self):
        del self.data['value']
        generators.CriteriaNodeGenerator(self.data, factories.PageFactory()).generate(ElementTree.Element('test'))

    @raises(ValueError)
    def test_error_if_empty_value(self):
        self.data['value'] = ''
        generators.CriteriaNodeGenerator(self.data, factories.PageFactory()).generate(ElementTree.Element('test'))

    @raises(ValueError)
    def test_error_if_no_element(self):
        del self.data['criteria_element']
        generators.CriteriaNodeGenerator(self.data, factories.PageFactory()).generate(ElementTree.Element('test'))

    @raises(ValueError)
    def test_error_if_invalid_element(self):
        self.data['criteria_element'] = 99999
        generators.CriteriaNodeGenerator(self.data, factories.PageFactory()).generate(ElementTree.Element('test'))

    def test_props(self):
        generator = generators.CriteriaNodeGenerator(self.data, factories.PageFactory())
        expected = {
            'value': self.data['value'],
            'id': str(self.element.pk),
            'type': self.data['node_type']
        }
        assert_equals(generator.get_properties(), expected)

    def test_has_correct_name(self):
        generator = generators.CriteriaNodeGenerator(self.data, factories.PageFactory())
        assert_equals(generator.name, 'Criteria')

    def test_generates_node(self):
        generator = generators.CriteriaNodeGenerator(self.data, factories.PageFactory())
        assert_is_not_none(generator.get_etree_node(ElementTree.Element('test')))


class ProtocolBuilderTestCase(TestCase):
    def setUp(self):
        self.procedure = factories.ProcedureFactory(
            author='TestUser',
            title='Burns"\''
        )

        for i in range(4):
            page = factories.PageFactory(
                procedure=self.procedure
            )

            factories.ElementFactory(
                page=page
            )

        elements = Element.objects.all()

        factories.ShowIfFactory(
            page=page,
            conditions=json.dumps({
                'node_type': 'NOT',
                'children': [
                    {
                        'node_type': 'AND',
                        'children': [
                            {
                                'criteria_element': elements[0].pk,
                                'node_type': 'EQUALS',
                                'value': 'foo'
                            },
                            {
                                'criteria_element': elements[1].pk,
                                'node_type': 'LESS',
                                'value': 'bar'
                            },
                            {
                                'node_type': 'AND',
                                'children': [
                                    {
                                        'criteria_element': elements[2].pk,
                                        'node_type': 'GREATER',
                                        'value': 'bar'
                                    }
                                ]
                            }
                        ]
                    }
                ]
            }))

        self.procedure.save()

    def test_generates_tree(self):
        tree = generators.ProtocolBuilder.generate_etree(factories.UserFactory(), self.procedure.id)

        assert_equals(len(tree), 4)

        for child in [tree[index] for index in [0, 1, 2]]:
            assert_equals(len(child), 1)

        assert_equals(len(tree[3]), 2)

    def test_generates_string_output(self):
        protocol = generators.ProtocolBuilder.generate(factories.UserFactory(), self.procedure.id)
        assert_is_not_none(protocol)

    @raises(ValueError)
    def test_invalid_owner(self):
        bad_user = factories.UserFactory(
            username='baduser'
        )

        generators.ProtocolBuilder.generate(bad_user, self.procedure.id)

    @raises(ValueError)
    def test_procedure_does_not_exist(self):
        generators.ProtocolBuilder.generate(factories.UserFactory(), -1)

    def test_escapes(self):
        procedure = factories.ProcedureFactory(
            title='"\''
        )
        protocol = generators.ProtocolBuilder.generate(factories.UserFactory(), procedure.id)

        assert_in('title="&quot;\'"', protocol)
