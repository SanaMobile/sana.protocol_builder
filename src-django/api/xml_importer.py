
from django.db import transaction
from xml.etree import ElementTree

from api.models import Concept, Element, Page, Procedure

import json
import uuid


class AttributeExtractor:
    @staticmethod
    def extract(element, attributes):
        extracted_dict = {}
        for attr_name, field_name in attributes.iteritems():
            if attr_name in element.attrib:
                extracted_dict[field_name] = element.attrib[attr_name]

        return extracted_dict


class ProcedureCreator:
    ELEMENT_NAME = 'Procedure'
    _ATTRIBUTES = {
        'title': 'title',
        'author': 'author',
        'uuid': 'uuid',
    }

    @classmethod
    def create_from(cls, owner, procedure_node):
        fields_dict = AttributeExtractor.extract(procedure_node, cls._ATTRIBUTES)
        fields_dict['owner'] = owner
        fields_dict['uuid'] = cls._parse_uuid(fields_dict['uuid'])
        return Procedure(**fields_dict)

    @classmethod
    def _parse_uuid(cls, uuid_str):
        return uuid.UUID(uuid_str).hex


class PageCreator:
    ELEMENT_NAME = 'Page'

    @classmethod
    def create_from(cls, procedure_id, display_index):
        fields_dict = {
            'display_index': display_index,
            'procedure_id': procedure_id,
        }
        return Page(**fields_dict)


class ElementCreator:
    ELEMENT_NAME = 'Element'
    _ATTRIBUTES = {
        'type': 'element_type',
        'concept': 'concept',
        'question': 'question',
        'answer': 'answer',
        'required': 'required',
        'image': 'image',
        'audio': 'audio',
        'action': 'action',
        'mime_type': 'mime_type',
        'choices': 'choices',
    }

    @classmethod
    def create_from(cls, element_node, page_id, display_index):
        fields_dict = AttributeExtractor.extract(element_node, cls._ATTRIBUTES)
        fields_dict['page_id'] = page_id
        fields_dict['display_index'] = display_index

        fields_dict['concept'] = cls._parse_concept(fields_dict['concept'])

        fields_dict['answer'] = cls._parse_csv(fields_dict['answer'])
        if 'choices' in fields_dict:
            fields_dict['choices'] = cls._parse_csv(fields_dict['choices'])

        if 'required' in fields_dict:
            fields_dict['required'] = cls._parse_bool(fields_dict['required'])

        return Element(**fields_dict)

    @classmethod
    def _parse_csv(cls, csv):
        parsed_items = csv.split(',')
        unescaped_list = [item.replace('&comma;', ',') for item in parsed_items]

        return json.dumps(unescaped_list)

    @classmethod
    def _parse_bool(cls, bool_str):
        return bool_str == 'true'

    @classmethod
    def _parse_concept(cls, concept_name):
        return Concept.objects.get(name=concept_name)


class ProtocolImporter:
    @classmethod
    def from_xml(cls, owner, xml_str):
        root = ElementTree.fromstring(xml_str)
        with transaction.atomic():
            cls._import_procedure(owner, root)

    @classmethod
    def _import_procedure(cls, owner, procedure_node):
        if procedure_node.tag != ProcedureCreator.ELEMENT_NAME:
            raise ValueError('Unknown Procedure tag "{0}"'.format(procedure_node.tag))

        # expect procedure to be root element
        procedure_model = ProcedureCreator.create_from(owner, procedure_node)
        procedure_model.save()

        cls._import_pages(procedure_node, procedure_model.id)

    @classmethod
    def _import_pages(cls, procedure_node, procedure_id):
        display_index = 0
        for page_node in procedure_node.findall(PageCreator.ELEMENT_NAME):
            page_model = PageCreator.create_from(procedure_id, display_index)
            page_model.save()

            cls._import_elements(page_node, page_model.id)

            display_index += 1

    @classmethod
    def _import_elements(cls, page_node, page_id):
        display_index = 0
        for element_node in page_node.findall(ElementCreator.ELEMENT_NAME):
            element_model = ElementCreator.create_from(element_node, page_id, display_index)
            element_model.save()

            display_index += 1
