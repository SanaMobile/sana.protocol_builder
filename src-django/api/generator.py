from xml.etree import ElementTree
from xml.dom import minidom
from models import Procedure, Element, ShowIf
import json


def raise_error_on_page(error_string, page):
    raise ValueError('Error on page %d with display_index %d: %s' % (page.id, page.display_index, error_string))


class ProcedureGenerator:
    def __init__(self, procedure):
        self.name = 'Procedure'
        self.procedure = procedure

        if not self.procedure.title:
            raise ValueError('Missing procedure title')

        if not self.procedure.author:
            raise ValueError('Missing procedure author')

    def __get_properties(self):
        props = {
            'title': self.procedure.title,
            'author': self.procedure.author,
            'uuid': str(self.procedure.uuid),
            'version': str(self.procedure.last_modified)
        }

        return props

    def generate(self):
        element = ElementTree.Element(self.name)
        element.attrib = self.__get_properties()

        return element


class PageGenerator:
    def __init__(self, page):
        self.name = 'Page'
        self.page = page

        if not self.page.elements.all():
            raise ValueError('Page with display index %d is empty' % self.page.display_index)

    def generate(self, parent):
        return ElementTree.SubElement(parent, self.name)


class ElementGenerator:
    def __init__(self, element):
        self.name = 'Element'
        self.element = element

        if not self.element.concept:
            raise_error_on_page('Element has no concept', self.element.page)

        if not self.element.question:
            raise_error_on_page('Element has no question', self.element.page)

        if self.element.answer is None:
            raise_error_on_page('Element has no answer', self.element.page)

        if self.element.element_type in Element.CHOICE_TYPES and not self.element.choices:
            raise_error_on_page('Element has no choices', self.element.page)

        if self.element.element_type in Element.PLUGIN_TYPES:
            if not self.element.action:
                raise_error_on_page('Element needs action', self.element.page)

            if not self.element.mime_type:
                raise_error_on_page('Element needs mime_type', self.element.page)

    def __get_properties(self):
        props = {
            'type': self.element.element_type,
            'id': str(self.element.pk),
            'concept': self.element.concept.name,
            'question': self.element.question,
            'answer': self.__parse_answers()
        }

        if self.element.required:
            props['required'] = str(self.element.required).lower()

        if self.element.image:
            props['image'] = self.element.image

        if self.element.audio:
            props['audio'] = self.element.audio

        if self.element.element_type in Element.PLUGIN_TYPES:
            props['action'] = self.element.action
            props['mime_type'] = self.element.mime_type

        if self.element.element_type in Element.CHOICE_TYPES:
            props['choices'] = self.__parse_choices()

        return props

    def __parse_choices(self):
        return self.__parse(self.element.choices)

    def __parse_answers(self):
        return self.__parse(self.element.answer)

    def __parse(self, field):
        item_list = [item.replace(';', '&semi&') for item in json.loads(field)]

        return ';'.join(item_list)

    def generate(self, parent):
        props = self.__get_properties()
        return ElementTree.SubElement(parent, self.name, props)


class ShowIfGenerator:
    def __init__(self, show_if):
        self.name = 'ShowIf'
        self.show_if = show_if

        if not self.show_if.conditions:
            raise_error_on_page('conditions', self.show_if.page)

    def generate_show_if(self, parent):
        return ElementTree.SubElement(parent, self.name)

    def generate(self, parent):
        show_if_element = self.generate_show_if(parent)
        conditions = json.loads(self.show_if.conditions)
        return ConditionNodeGenerator(conditions, self.show_if.page).generate(show_if_element)


class LogicalNodeGenerator:
    def __init__(self, condition_node, page):
        self.name = condition_node['node_type'].lower()
        self.condition_node = condition_node
        self.page = page

        if condition_node['node_type'] not in ShowIf.LOGICAL_TYPES:
            raise_error_on_page('node type must be either AND, OR, or NOT', self.page)

    def get_etree_node(self, parent):
        if self.condition_node['node_type'] != 'NOT' and len(self.condition_node['children']) == 1:
            return None
        else:
            return ElementTree.SubElement(parent, self.name, {})


class CriteriaNodeGenerator:
    def __init__(self, condition_node, page):
        self.name = 'Criteria'
        self.page = page
        self.condition_node = condition_node

        if self.condition_node['node_type'] not in ShowIf.CRITERIA_TYPES:
            raise_error_on_page('node type must be either EQUALS, LESS, or GREATER', self.page)

        if 'value' not in self.condition_node or not self.condition_node['value']:
            raise_error_on_page('Value missing for criteria node', self.page)

        if 'criteria_element' not in self.condition_node or not self.condition_node['criteria_element']:
            raise_error_on_page('Element missing for criteria node', self.page)

        try:
            self.criteria_element = Element.objects.get(pk=self.condition_node['criteria_element'])
        except Element.DoesNotExist:
            raise_error_on_page('Invalid element type for criteria node {0}'.format(self.condition_node), self.page)

    def get_etree_node(self, parent):
        return ElementTree.SubElement(parent, self.name, self.get_properties())

    def get_properties(self):
        return {
            'value': self.condition_node['value'],
            'id': str(self.criteria_element.pk),
            'type': self.condition_node['node_type']
        }


class ConditionNodeGenerator:
    def __init__(self, condition_node, page):
        self.condition_node = condition_node
        self.page = page

    def generate(self, parent):
        return self.generate_node(parent, self.condition_node)

    def generate_logical_tree(self, parent, condition_node):
        if 'children' in condition_node:
            for node in condition_node['children']:
                self.generate_node(parent, node)

        return parent

    def generate_node(self, parent, node):
        etree_node = self.get_etree_node(parent, node)
        if etree_node is not None:
            return self.generate_logical_tree(etree_node, node)
        else:
            return self.generate_logical_tree(parent, node)

    def get_etree_node(self, parent, condition_node):
        if condition_node['node_type'] in ShowIf.LOGICAL_TYPES:
            self.generator = LogicalNodeGenerator(condition_node, self.page)
        else:
            self.generator = CriteriaNodeGenerator(condition_node, self.page)

        return self.generator.get_etree_node(parent)


class ProtocolBuilder:
    @classmethod
    def __prettify(cls, elem):
        rough_string = ElementTree.tostring(elem, 'utf-8')
        reparsed = minidom.parseString(rough_string)
        xml_header_length = len(minidom.Document().toxml())
        return reparsed.toprettyxml(indent=' ' * 4)[xml_header_length:]

    @classmethod
    def generate_etree(cls, owner, pk):
        try:
            procedure = Procedure.objects.get(pk=pk)
        except Procedure.DoesNotExist:
            raise ValueError('Invalid procedure id')

        # TODO Security issue: Allow any user (even unauthenticated) to access any procedure
        # if procedure.owner != owner:
        #     raise ValueError('Invalid owner')

        procedure_etree_element = ProcedureGenerator(procedure).generate()

        for page in procedure.pages.all():
            page_element = PageGenerator(page).generate(procedure_etree_element)

            for show_if in page.show_if.all():
                ShowIfGenerator(show_if).generate(page_element)

            for element in page.elements.all():
                ElementGenerator(element).generate(page_element)

        return procedure_etree_element

    @classmethod
    def generate(cls, owner, pk):
        return cls.__prettify(cls.generate_etree(owner, pk))
