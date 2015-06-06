from xml.etree import ElementTree
from xml.dom import minidom
from models import Procedure


class ProcedureGenerator:
    def __init__(self, procedure):
        self.name = 'Procedure'
        self.procedure = procedure

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

    def generate(self, parent):
        return ElementTree.SubElement(parent, self.name)


class ElementGenerator:
    def __init__(self, element):
        self.name = 'Name'
        self.element = element

    def __get_properties(self):
        props = {
            'type': self.element.element_type,
            'id': self.element.eid,
            'concept': self.element.concept,
            'question': self.element.question,
            'answer': self.element.answer
        }

        if self.element.numeric:
            props['numeric'] = self.element.numeric

        if self.element.choices:
            props['choices'] = self.element.choices

        return props

    def generate(self, parent):
        props = self.__get_properties()
        return ElementTree.SubElement(parent, self.name, props)


class ProtocolBuilder:
    @classmethod
    def __prettify(cls, elem):
        rough_string = ElementTree.tostring(elem, 'utf-8')
        reparsed = minidom.parseString(rough_string)
        return reparsed.toprettyxml(indent="    ")

    @classmethod
    def generateETree(cls, owner, pk):
        try:
            procedure = Procedure.objects.get(pk=pk)
        except Procedure.DoesNotExist:
            raise ValueError('Invalid procedure id')

        if procedure.owner != owner:
            raise ValueError('Invalid owner')

        procedure_element = ProcedureGenerator(procedure).generate()

        for page in procedure.pages.all():
            page_element = PageGenerator(page).generate(procedure_element)

            for element in page.elements.all():
                ElementGenerator(element).generate(page_element)

        return procedure_element

    @classmethod
    def generate(cls, owner, pk):
        return cls.__prettify(cls.generateETree(owner, pk))
