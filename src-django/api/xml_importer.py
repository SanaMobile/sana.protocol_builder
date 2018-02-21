from django.db import transaction
from xml.etree import ElementTree

from api.models import Concept, Element, AbstractElement, Page, Procedure, ShowIf

import json
import uuid


def extract_attributes(element, attributes):
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
        fields_dict = extract_attributes(procedure_node, cls._ATTRIBUTES)
        fields_dict['owner'] = owner

        if 'uuid' in fields_dict:
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
        fields_dict = extract_attributes(element_node, cls._ATTRIBUTES)
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
        concepts = Concept.objects.filter(name=concept_name)

        if not concepts:
            raise ValueError('No concept named "{}"'.format(concept_name))

        return concepts[0]

class AbstractElementCreator:
    ELEMENT_NAME = 'AbstractElement'
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
        fields_dict = extract_attributes(element_node, cls._ATTRIBUTES)
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
        concepts = Concept.objects.filter(name=concept_name)

        if not concepts:
            raise ValueError('No concept named "{}"'.format(concept_name))

        return concepts[0]

class ShowIfCreator:
    ELEMENT_NAME = 'ShowIf'
    _CRITERIA_ELEMENT_NAME = 'Criteria'
    _CRITERIA_ATTR = {
        'type': 'node_type',
        'id': 'criteria_element',
        'value': 'value',
    }

    @classmethod
    def create_from(cls, showif_node, page_id, element_id_map):
        conditions = cls._parse_conditions(showif_node[0], element_id_map)

        fields_dict = {
            'page_id': page_id,
            'conditions': json.dumps(conditions)
        }
        return ShowIf(**fields_dict)

    @classmethod
    def _parse_conditions(cls, node, element_id_map):
        if node.tag == cls._CRITERIA_ELEMENT_NAME:
            criteria_dict = extract_attributes(node, cls._CRITERIA_ATTR)

            if criteria_dict['node_type'] not in ShowIf.CRITERIA_TYPES:
                raise ValueError(
                    'Invalid criteria type "{0}"'.format(criteria_dict['node_type'])
                )

            prev_id = criteria_dict['criteria_element']
            criteria_dict['criteria_element'] = element_id_map[prev_id]

            return criteria_dict
        elif node.tag.upper() in ShowIf.LOGICAL_TYPES:
            logical_dict = {
                'node_type': node.tag.upper(),
                'children': []
            }

            for child in node:
                logical_dict['children'].append(cls._parse_conditions(child, element_id_map))

            return logical_dict
        else:
            raise ValueError(
                'Invalid logical type "{0}"'.format(node.tag.upper())
            )


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
        element_id_map = {}
        display_index = 0
        for page_node in procedure_node.findall(PageCreator.ELEMENT_NAME):
            page_model = PageCreator.create_from(procedure_id, display_index)
            page_model.save()

            cls._import_showif(page_node, page_model.id, element_id_map)
            cls._import_elements(page_node, page_model.id, element_id_map)

            display_index += 1

    @classmethod
    def _import_showif(cls, page_node, page_id, element_id_map):
        showif_node = page_node.find(ShowIfCreator.ELEMENT_NAME)
        if showif_node is not None:
            showif_model = ShowIfCreator.create_from(showif_node, page_id, element_id_map)
            showif_model.save()

    @classmethod
    def _import_elements(cls, page_node, page_id, element_id_map):
        display_index = 0
        for element_node in page_node.findall(ElementCreator.ELEMENT_NAME):
            element_model = ElementCreator.create_from(element_node, page_id, display_index)
            element_model.save()

            # update the element_id_map
            prev_id = element_node.attrib['id']
            element_id_map[prev_id] = element_model.id

            display_index += 1
