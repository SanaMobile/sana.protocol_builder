from django.test import TestCase, Client
from rest_framework import status
from rest_framework.authtoken.models import Token
from nose.tools import assert_equals
from api.startup import grant_permissions
from utils.helpers import add_token_to_header
from utils import factories
from api.models import Concept
import json


class ConceptTest(TestCase):

    def setUp(self):
        self.client = Client()
        self.token = Token.objects.get(user=factories.UserFactory())
        self.concept_url = '/api/concepts'
        self.data = {
            'name': 'SX SITE SWELLING',
            'display_name': 'Swelling at surgical site',
            'description': 'Swelling observed at surgical site post procedure',
            'data_type': 'string',
            'mime_type': 'text/plain',
            'constraint': 'yes;no'
        }
        self.user = factories.UserFactory()
        grant_permissions()

    def test_concept_fields_are_present(self):
        response = self.client.post(
            path=self.concept_url,
            data=json.dumps(self.data),
            content_type='application/json',
            HTTP_AUTHORIZATION=add_token_to_header(self.user, self.token)
        )

        assert_equals(response.status_code, status.HTTP_201_CREATED)
        body = json.loads(response.content)

        assert_equals(len(body['uuid']), 36)
        assert_equals(body['name'], self.data['name'])
        assert_equals(body['display_name'], self.data['display_name'])
        assert_equals(body['description'], self.data['description'])
        assert_equals(body['data_type'], self.data['data_type'])
        assert_equals(body['mime_type'], self.data['mime_type'])
        assert_equals(body['constraint'], self.data['constraint'])

        concept = Concept.objects.get(pk=body['id'])
        assert_equals(concept.name, self.data['name'])
