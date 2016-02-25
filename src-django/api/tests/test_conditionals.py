from django.test import TestCase, Client
from rest_framework import status
from rest_framework.authtoken.models import Token
from api.models import ShowIf
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
            'conditions':
            {
                'node_type': 'NOT',
                'children': [
                    {
                        'node_type': 'AND',
                        'children': [
                            {
                                'criteria_element': self.element.pk,
                                'node_type': 'EQUALS',
                                'value': 'foo'
                            },
                            {
                                'criteria_element': self.element.pk,
                                'node_type': 'LESS',
                                'value': 'bar'
                            }
                        ]
                    }
                ]
            }
        }

        response = self.get_response()

        assert_equals(response.status_code, status.HTTP_201_CREATED)
        body = json.loads(response.content)
        assert_equals(body['page'], self.data['page'])
        assert_true('conditions' in self.data)
        assert_equals(body['conditions'], self.data['conditions'])
        assert_equals(ShowIf.objects.count(), 1)

    def test_update(self):
        show_if = factories.ShowIfFactory()

        self.data = {
            'page': show_if.page.pk,
            'conditions':
            {
                'criteria_element': self.element.pk,
                'node_type': 'EQUALS',
                'value': 'foo'
            }
        }

        response = self.client.put(
            path=self.conditional_url + '/{id}'.format(id=show_if.pk),
            data=json.dumps(self.data),
            content_type='application/json',
            HTTP_AUTHORIZATION=add_token_to_header(self.user, self.token)
        )

        assert_equals(response.status_code, status.HTTP_200_OK)
        body = json.loads(response.content)

        assert_equals(body['page'], self.data['page'])
        assert_true('conditions' in self.data)
        assert_equals(body['conditions'], self.data['conditions'])

    def test_delete(self):
        show_if = factories.ShowIfFactory()

        response = self.client.delete(
            path=self.conditional_url + '/{id}'.format(id=show_if.pk),
            content_type='application/json',
            HTTP_AUTHORIZATION=add_token_to_header(self.user, self.token)
        )

        assert_equals(response.status_code, status.HTTP_204_NO_CONTENT)

        assert_equals(ShowIf.objects.count(), 0)

    def test_invalid_node_type(self):
        self.data = {
            'page': self.element.page.pk,
            'conditions':
            {
                'criteria_element': self.element.pk,
                'node_type': 'FOO',
                'value': 'foo'
            }
        }

        assert_equals(self.get_conditions(), ['Invalid node type "FOO"'])

        self.data = {
            'page': self.element.page.pk,
            'conditions':
            {
                'criteria_element': self.element.pk,
                'value': 'foo'
            }
        }

        assert_equals(self.get_conditions(), ['Missing or invalid node type'])

    def test_bad_criteria_node(self):
        self.data = {
            'page': self.element.page.pk,
            'conditions':
            {
                'node_type': 'GREATER',
                'value': 'foo',
                'criteria_element': ''
            }
        }

        assert_equals(self.get_conditions(), ['CRITERIA criteria_element must be an integer'])

        self.data['conditions'] = {
            'criteria_element': self.element.pk,
            'node_type': 'EQUALS',
            'value': []
        }

        assert_equals(self.get_conditions(), ['CRITERIA value must be a string'])

        self.data['conditions'] = {
            'criteria_element': self.element.pk,
            'node_type': 'LESS',
            'value': 'foo',
            'children': []
        }

        assert_equals(self.get_conditions(), ['CRITERIA node must have no children'])

    def test_bad_non_criteria_node(self):
        self.data = {
            'page': self.element.page.pk,
            'conditions':
            {
                'node_type': 'AND',
                'value': 'foo',
                'children': []
            }

        }

        assert_equals(self.get_conditions(), ['Only "CRITERIA" should have a value'])

        self.data = {
            'page': self.element.page.pk,
            'conditions':
            {
                'node_type': 'AND',
                'criteria_element': self.element.pk,
                'children': []
            }
        }

        assert_equals(self.get_conditions(), ['Only "CRITERIA" should have an element'])

        self.data = {
            'page': self.element.page.pk,
            'conditions':
            {
                'node_type': 'AND'
            }
        }

        assert_equals(self.get_conditions(), ['Logical nodes must have children'])

    def test_number_of_children_for_not(self):
        self.data = {
            'page': self.element.page.pk,
            'conditions':
            {
                'node_type': 'NOT',
                'children': [
                    {
                        'criteria_element': self.element.pk,
                        'node_type': 'EQUALS',
                        'value': 'foo'
                    },
                    {
                        'criteria_element': self.element.pk,
                        'node_type': 'LESS',
                        'value': 'bar'
                    }
                ]
            }
        }

        assert_equals(self.get_conditions(), ['NOT nodes must have exactly 1 child'])

        self.data = {
            'page': self.element.page.pk,
            'conditions':
            {
                'node_type': 'NOT',
                'children': []
            }
        }

        assert_equals(self.get_conditions(), ['NOT nodes must have exactly 1 child'])

    def test_number_of_children_for_and_or(self):
        self.data = {
            'page': self.element.page.pk,
            'conditions':
            {
                'node_type': 'OR',
                'children': []
            }
        }

        assert_equals(self.get_conditions(), ['AND and OR nodes must have at least 1 child'])

    def get_conditions(self):
        response = self.get_response()

        assert_equals(response.status_code, status.HTTP_400_BAD_REQUEST)

        body = json.loads(response.content)
        assert_true('conditions' in body)
        return body['conditions']

    def get_response(self):
        return self.client.post(
            path=self.conditional_url,
            data=json.dumps(self.data),
            content_type='application/json',
            HTTP_AUTHORIZATION=add_token_to_header(self.user, self.token)
        )
