from django.test import TestCase, Client
from rest_framework import status
from rest_framework.authtoken.models import Token
from nose.tools import assert_equals, assert_true
from api.startup import grant_permissions
from utils.helpers import add_token_to_header
from utils import factories
import json


class ConditionalTest(TestCase):
    def setUp(self):
        self.client = Client(enforce_csrf_checks=False)
        self.user = factories.UserFactory()
        self.element = factories.ElementFactory()
        self.token = Token.objects.get(user=self.user)
        self.conditional_url = '/api/conditionals'

        grant_permissions()

    def test_conditional_works(self):
        self.data = {
            'page': self.element.page.pk,
            'conditions': [
                {
                    'node_type': 'NOT',
                    'children': [
                        {
                            'node_type': 'AND',
                            'children': [
                                {
                                    'criteria_element': self.element.pk,
                                    'node_type': 'CRITERIA',
                                    'criteria_type': 'EQUALS',
                                    'value': 'foo'
                                },
                                {
                                    'criteria_element': self.element.pk,
                                    'node_type': 'CRITERIA',
                                    'criteria_type': 'EQUALS',
                                    'value': 'bar'
                                }
                            ]
                        }
                    ]
                }
            ]
        }

        response = self.get_response()

        assert_equals(response.status_code, status.HTTP_201_CREATED)
        body = json.loads(response.content)
        assert_equals(body['page'], self.data['page'])
        assert_equals(len(body['conditions']), len(self.data['conditions']))

        for body_cond, data_cond in zip(body['conditions'], self.data['conditions']):
            assert_equals(body_cond['node_type'], data_cond['node_type'])

            for body_cond_2, data_cond_2 in zip(body_cond['children'], data_cond['children']):
                assert_equals(body_cond_2['node_type'], data_cond_2['node_type'])

                for body_cond_3, data_cond_3 in zip(body_cond_2['children'], data_cond_2['children']):
                    assert_equals(body_cond_3['node_type'], data_cond_3['node_type'])
                    assert_equals(body_cond_3['criteria_type'], data_cond_3['criteria_type'])
                    assert_equals(body_cond_3['criteria_element'], data_cond_3['criteria_element'])
                    assert_equals(body_cond_3['value'], data_cond_3['value'])

    def test_show_if_error_conditions(self):
        factories.ShowIfFactory(
            page=self.element.page
        )

        self.data = {
            'page': self.element.page.pk,
            'conditions': [
                {
                    'criteria_element': self.element.pk,
                    'node_type': 'CRITERIA',
                    'criteria_type': 'EQUALS',
                    'value': 'foo'
                },
                {
                    'criteria_element': self.element.pk,
                    'node_type': 'CRITERIA',
                    'criteria_type': 'EQUALS',
                    'value': 'bar'
                }
            ]
        }

        response = self.get_response()

        assert_equals(response.status_code, status.HTTP_400_BAD_REQUEST)

        body = json.loads(response.content)

        assert_equals(body['conditions'], ['Can only have one condition!'])
        assert_equals(body['page'], ['Page already has a show_if'])

    def test_invalid_node_type(self):
        self.data = {
            'page': self.element.page.pk,
            'conditions': [
                {
                    'criteria_element': self.element.pk,
                    'node_type': 'FOO',
                    'criteria_type': 'EQUALS',
                    'value': 'foo'
                }
            ]
        }

        conditions = self.get_conditions()

        assert_equals(conditions['node_type'], ['"FOO" is not a valid choice.'])

    def test_bad_criteria_node(self):
        self.data = {
            'page': self.element.page.pk,
            'conditions': [
                {
                    'criteria_element': self.element.pk,
                    'node_type': 'CRITERIA',
                    'value': 'foo'
                }
            ]
        }

        conditions = self.get_conditions()
        assert_equals(conditions['non_field_errors'], ['"CRITERIA" node type requires a criteria type'])

        self.data['conditions'] = [
            {
                'criteria_element': self.element.pk,
                'node_type': 'CRITERIA',
                'criteria_type': 'BLAH',
                'value': 'foo'
            }
        ]

        conditions = self.get_conditions()
        assert_equals(conditions['criteria_type'], ['"BLAH" is not a valid choice.'])

        self.data['conditions'] = [
            {
                'node_type': 'CRITERIA',
                'criteria_type': 'EQUALS',
                'value': 'foo'
            }
        ]

        conditions = self.get_conditions()
        assert_equals(conditions['non_field_errors'], ['CRITERIA must have an element'])

        self.data['conditions'] = [
            {
                'criteria_element': self.element.pk,
                'node_type': 'CRITERIA',
                'criteria_type': 'EQUALS',
            }
        ]

        conditions = self.get_conditions()
        assert_equals(conditions['non_field_errors'], ['CRITERIA must have a value'])

        self.data['conditions'] = [
            {
                'criteria_element': self.element.pk,
                'node_type': 'CRITERIA',
                'criteria_type': 'EQUALS',
                'value': 'foo',
                'children': []
            }
        ]

        conditions = self.get_conditions()
        assert_equals(conditions['non_field_errors'], ['CRITERIA node must have no children'])

    def test_bad_non_criteria_node(self):
        self.data = {
            'page': self.element.page.pk,
            'conditions': [
                {
                    'node_type': 'AND',
                    'value': 'foo'
                }
            ]
        }

        conditions = self.get_conditions()
        assert_equals(conditions['non_field_errors'], ['Only "CRITERIA" should have a value'])

        self.data = {
            'page': self.element.page.pk,
            'conditions': [
                {
                    'node_type': 'AND',
                    'criteria_element': self.element.pk
                }
            ]
        }

        conditions = self.get_conditions()
        assert_equals(conditions['non_field_errors'], ['Only "CRITERIA" should have an element'])

        self.data = {
            'page': self.element.page.pk,
            'conditions': [
                {
                    'node_type': 'AND',
                    'criteria_type': 'EQUALS'
                }
            ]
        }

        conditions = self.get_conditions()
        assert_equals(conditions['non_field_errors'], ['Only "CRITERIA" should have a criteria type'])

    def test_number_of_children_for_not(self):
        self.data = {
            'page': self.element.page.pk,
            'conditions': [
                {
                    'node_type': 'NOT',
                    'children': [
                        {
                            'criteria_element': self.element.pk,
                            'node_type': 'CRITERIA',
                            'criteria_type': 'EQUALS',
                            'value': 'foo'
                        },
                        {
                            'criteria_element': self.element.pk,
                            'node_type': 'CRITERIA',
                            'criteria_type': 'EQUALS',
                            'value': 'bar'
                        }
                    ]
                }
            ]
        }

        conditions = self.get_conditions()
        assert_equals(conditions['non_field_errors'], ['NOT nodes can not have multiple children'])

    def test_number_of_children_for_and_or(self):
        self.data = {
            'page': self.element.page.pk,
            'conditions': [
                {
                    'node_type': 'AND',
                    'children': [
                        {
                            'criteria_element': self.element.pk,
                            'node_type': 'CRITERIA',
                            'criteria_type': 'EQUALS',
                            'value': 'foo'
                        },
                        {
                            'criteria_element': self.element.pk,
                            'node_type': 'CRITERIA',
                            'criteria_type': 'EQUALS',
                            'value': 'bar'
                        },
                        {
                            'criteria_element': self.element.pk,
                            'node_type': 'CRITERIA',
                            'criteria_type': 'EQUALS',
                            'value': 'baz'
                        }
                    ]
                }
            ]
        }

        conditions = self.get_conditions()
        assert_equals(conditions['non_field_errors'], ['AND and OR nodes can not have more than two children'])

        self.data = {
            'page': self.element.page.pk,
            'conditions': [
                {
                    'node_type': 'OR',
                    'children': [
                        {
                            'criteria_element': self.element.pk,
                            'node_type': 'CRITERIA',
                            'criteria_type': 'EQUALS',
                            'value': 'foo'
                        },
                        {
                            'criteria_element': self.element.pk,
                            'node_type': 'CRITERIA',
                            'criteria_type': 'EQUALS',
                            'value': 'bar'
                        },
                        {
                            'criteria_element': self.element.pk,
                            'node_type': 'CRITERIA',
                            'criteria_type': 'EQUALS',
                            'value': 'baz'
                        }
                    ]
                }
            ]
        }

        conditions = self.get_conditions()
        assert_equals(conditions['non_field_errors'], ['AND and OR nodes can not have more than two children'])

    def test_explicit_parent_or_show_if(self):
        node = factories.CriteriaConditionFactory()
        self.data = {
            'page': self.element.page.pk,
            'conditions': [
                {
                    'criteria_element': self.element.pk,
                    'node_type': 'CRITERIA',
                    'criteria_type': 'EQUALS',
                    'value': 'foo',
                    'parent': node.pk
                }
            ]
        }

        conditions = self.get_conditions()
        assert_equals(conditions['parent'], ['Do not specify parent, use nested creation'])

        self.data = {
            'page': self.element.page.pk,
            'conditions': [
                {
                    'criteria_element': self.element.pk,
                    'node_type': 'CRITERIA',
                    'criteria_type': 'EQUALS',
                    'value': 'foo',
                    'show_if': node.show_if.pk
                }
            ]
        }

        conditions = self.get_conditions()
        assert_equals(conditions['show_if'], ['Do not specify show_if, use nested creation'])

    def get_conditions(self):
        response = self.get_response()

        assert_equals(response.status_code, status.HTTP_400_BAD_REQUEST)

        body = json.loads(response.content)
        assert_true('conditions' in body)
        assert_equals(len(body['conditions']), 1)
        return body['conditions'][0]

    def get_response(self):
        return self.client.post(
            path=self.conditional_url,
            data=json.dumps(self.data),
            content_type='application/json',
            HTTP_AUTHORIZATION=add_token_to_header(self.user, self.token)
        )
