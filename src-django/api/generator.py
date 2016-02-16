from xml.etree import ElementTree
from xml.dom import minidom
from models import Procedure
import json


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
            'author': self.procedure.author
        }

        if self.procedure.version:
            props['version'] = self.procedure.version

        if self.procedure.uuid:
            props['uuid'] = self.procedure.uuid

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

        if not self.element.element_type:
            self.__raise_error('Element has no type')

        if not self.element.eid:
            self.__raise_error('Element has no id')

        if not self.element.concept:
            self.__raise_error('Element has no concept')

        if not self.element.question:
            self.__raise_error('Element has no question')

        if self.element.answer is None:
            self.__raise_error('Element has no answer')

    def __raise_error(self, error_string):
        page = self.element.page
        raise ValueError('Error on page %d with display_index %d: %s' % (page.id, page.display_index, error_string))

    def __get_properties(self):
        props = {
            'type': self.element.element_type,
            'id': self.element.eid,
            # TODO(josh): fix this
            # 'concept': self.element.concept,
            'question': self.element.question,
            'answer': self.element.answer
        }

        if self.element.numeric:
            props['numeric'] = self.element.numeric

        if self.element.choices:
            props['choices'] = self.__parse_choices()

        return props

    def __parse_choices(self):
        choice_list = json.loads(self.element.choices)
        return ','.join(choice_list)

    def generate(self, parent):
        props = self.__get_properties()
        return ElementTree.SubElement(parent, self.name, props)


class ProtocolBuilder:
    @classmethod
    def __prettify(cls, elem):
        rough_string = ElementTree.tostring(elem, 'utf-8')
        reparsed = minidom.parseString(rough_string)
        return reparsed.toprettyxml(indent=' ' * 4)

    @classmethod
    def generate_etree(cls, owner, pk):
        try:
            procedure = Procedure.objects.get(pk=pk)
        except Procedure.DoesNotExist:
            raise ValueError('Invalid procedure id')

        if procedure.owner != owner:
            raise ValueError('Invalid owner')

        procedure_etree_element = ProcedureGenerator(procedure).generate()

        for page in procedure.pages.all():
            page_element = PageGenerator(page).generate(procedure_etree_element)

            for element in page.elements.all():
                ElementGenerator(element).generate(page_element)

        return procedure_etree_element

    @classmethod
    def generate(cls, owner, pk):
        return cls.__prettify(cls.generate_etree(owner, pk))
