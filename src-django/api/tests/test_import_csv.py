from django.test import TestCase, Client
from rest_framework import status
from rest_framework.authtoken.models import Token
from nose.tools import assert_equals, assert_true, assert_false
from api.startup import grant_permissions
from utils.helpers import add_token_to_header
from utils import factories
import json
import os


class ImportCSVTest(TestCase):

    def setUp(self):
        self.client = Client()
        self.user = factories.UserFactory()
        self.token = Token.objects.get(user=self.user)
        self.import_csv_url = '/api/concepts/import_csv'
        grant_permissions()

    def test_valid_csv(self):
        concepts_file = open(os.path.join(os.path.dirname(__file__), 'fixtures/concepts_valid.csv'))

        response = self.client.post(
            path=self.import_csv_url,
            data={'csv': concepts_file},
            HTTP_AUTHORIZATION=add_token_to_header(self.user, self.token)
        )

        assert_equals(response.status_code, status.HTTP_200_OK)
        body = json.loads(response.content)

        assert_true('success' in body)
        assert_true(body['success'])

    def test_invalid_csv(self):
        concepts_file = open(os.path.join(os.path.dirname(__file__), 'fixtures/concepts_invalid.csv'))

        response = self.client.post(
            path=self.import_csv_url,
            data={'csv': concepts_file},
            HTTP_AUTHORIZATION=add_token_to_header(self.user, self.token)
        )

        assert_equals(response.status_code, status.HTTP_400_BAD_REQUEST)
        body = json.loads(response.content)

        assert_true('success' in body)
        assert_false(body['success'])

    def test_missing_csv_parameter(self):
        response = self.client.post(
            path=self.import_csv_url,
            data={},
            HTTP_AUTHORIZATION=add_token_to_header(self.user, self.token)
        )

        assert_equals(response.status_code, status.HTTP_400_BAD_REQUEST)
        body = json.loads(response.content)

        assert_true('success' in body)
        assert_false(body['success'])
