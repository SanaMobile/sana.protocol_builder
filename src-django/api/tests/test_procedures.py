from django.test import TestCase, Client
from rest_framework import status
from rest_framework.authtoken.models import Token
from nose.tools import assert_equals, assert_true
from api.startup import grant_permissions
from utils.helpers import add_token_to_header
from utils import factories
import json


class ProcedureTest(TestCase):

    def setUp(self):
        self.client = Client()
        self.token = Token.objects.get(user=factories.UserFactory())
        self.procedure_url = '/api/procedures'
        self.data = {
            'title': 'Example Title',
            'author': 'An Author'
        }
        self.user = factories.UserFactory()
        grant_permissions()

    def test_created_procedure_has_correct_owner(self):
        response = self.client.post(
            path=self.procedure_url,
            data=json.dumps(self.data),
            content_type='application/json',
            HTTP_AUTHORIZATION=add_token_to_header(self.user, self.token)
        )

        assert_equals(response.status_code, status.HTTP_201_CREATED)
        body = json.loads(response.content)

        assert_true('owner' in body)
        assert_equals(body['owner'], self.user.id)

    def test_procedure_comes_with_pages(self):
        procedure = factories.ProcedureFactory(owner=self.user)
        factories.PageFactory(procedure=procedure)
        flags = {
            'only_return_id': 'false'
        }

        response = self.client.get(
            path=self.procedure_url,
            data=flags,
            content_type='application/json',
            HTTP_AUTHORIZATION=add_token_to_header(self.user, self.token)
        )

        assert_equals(response.status_code, status.HTTP_200_OK)
        body = json.loads(response.content)
        pages = body[0]['pages']
        assert_equals(len(pages), 1)
        assert_true('display_index' in pages[0])
