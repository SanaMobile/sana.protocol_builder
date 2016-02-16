from django.test import TestCase, Client
from rest_framework import status
from rest_framework.authtoken.models import Token
from nose.tools import assert_equals
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
        self.data = {
            "page": self.element.page.pk,
            "conditions": [
                {
                    "node_type": "NOT",
                    "children": [
                        {
                            "node_type": "AND",
                            "children": [
                                {
                                    "criteria_element": self.element.pk,
                                    "node_type": "CRITERIA",
                                    "criteria_type": "EQUALS",
                                    "value": "foo"
                                },
                                {
                                    "criteria_element": self.element.pk,
                                    "node_type": "CRITERIA",
                                    "criteria_type": "EQUALS",
                                    "value": "bar"
                                }
                            ]
                        }
                    ]
                }
            ]
        }

        grant_permissions()

    def test_conditional_works(self):
        response = self.client.post(
            path=self.conditional_url,
            data=json.dumps(self.data),
            content_type='application/json',
            HTTP_AUTHORIZATION=add_token_to_header(self.user, self.token)
        )

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
