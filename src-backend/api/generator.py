from xml.etree import ElementTree
from xml.dom import minidom
from models import *


class ProcedureGenerator:
    def __init__(self, procedure):
        self.name = 'Procedure'
        self.procedure = procedure

    def _get_properties(self):
        props = {
            'title': self.procedure.title,
            'author': self.procedure.author
        }

        if not procedure.version:
            props['version'] = self.procedure.version

        if not procedure.uuid:
            props['uuid'] = self.procedure.uuid

        return props

    def generate(self):
        element = ElementTree.Element(self.name)
        element.attrib = self._get_properties()

        return element.attrib


class PageGenerator:
    def __init__(self, page):
        self.name = 'Page'
        self.page = page

    def generate(self, parent):
        return ElementTree.SubElement(parent, self.name)


class ElementGenerator:
    def __init__(self, element):
        self.name = 'Name'
        self.element = element

    def _get_properties(self):
        props = {
            'type': element.element_type,
            'id': element.eid,
            'concept': element.concept,
            'question': element.question,
            'answer': element.answer
        }

        if not element.numeric:
            props['numeric'] = self.element.numeric

        if not element.choices:
            props['choices'] = self.element.choices

        return props

    def generate(self, parent):
        props = self._get_properties()
        ElementTree.SubElement(parent, self.name, props)


class ProtocolBuilder:
    @classmethod
    def _prettify(cls, elem):
        rough_string = ElementTree.tostring(elem, 'utf-8')
        reparsed = minidom.parseString(rough_string)
        return reparsed.toprettyxml(indent="  ")

    @classmethod
    def generate(cls, owner, pk):
        try:
            procedure = Procedure.objects.get(pk=pk)
        except Procedure.DoesNotExist:
            raise ValueError('Invalid procedure id')

        if procedure.owner != owner:
            raise ValueError('Invalid owner')

        procedureElement = ProcedureGenerator(procedure).generate()

        for page in procedure.pages:
            pageElement = PageGenerator(page).generate(procedureElement)

            for element in page.elements:
                ElementGenerator(element).generate(pageElement)

        return cls._prettify(procedureElement)
