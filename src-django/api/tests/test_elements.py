from django.test import TestCase, Client
from rest_framework import status
from rest_framework.authtoken.models import Token
from api.startup import grant_permissions
from nose.tools import assert_equals
from utils.helpers import add_token_to_header
from utils import factories
import json


class TestElements(TestCase):
    def setUp(self):
        self.client = Client()
        self.user = factories.UserFactory()
        procedure = factories.ProcedureFactory()
        self.page1 = factories.PageFactory(
            display_index=0,
            procedure=procedure
        )
        self.page2 = factories.PageFactory(
            display_index=1,
            procedure=procedure
        )
        self.page3 = factories.PageFactory(
            display_index=2,
            procedure=procedure
        )
        self.element1 = factories.ElementFactory(
            page=self.page1
        )
        self.element2 = factories.ElementFactory(
            page=self.page2
        )
        self.element3 = factories.ElementFactory(
            page=self.page3
        )

        self.token = Token.objects.get(user=self.user)
        self.path = '/api/elements/{0}/elements_before'
        grant_permissions()

    def test_gets_before(self):
        response = self.client.get(
            path=self.path.format(self.element3.pk),
            content_type='application/json',
            HTTP_AUTHORIZATION=add_token_to_header(self.user, self.token)
        )

        assert_equals(response.status_code, status.HTTP_200_OK)

        elements = json.loads(response.content)

        assert_equals(len(elements), 2)
        assert_equals(elements[0]['id'], self.element1.pk)
        assert_equals(elements[1]['id'], self.element2.pk)

    def test_invalid_pk(self):
        response = self.client.get(
            path=self.path.format(99),
            content_type='application/json',
            HTTP_AUTHORIZATION=add_token_to_header(self.user, self.token)
        )

        assert_equals(response.status_code, status.HTTP_400_BAD_REQUEST)
        error = json.loads(response.content)
        assert_equals(error['pk'], ['Invalid element'])

    def test_returns_none(self):
        response = self.client.get(
            path=self.path.format(self.element1.pk),
            content_type='application/json',
            HTTP_AUTHORIZATION=add_token_to_header(self.user, self.token)
        )

        assert_equals(response.status_code, status.HTTP_200_OK)

        elements = json.loads(response.content)
        assert_equals(len(elements), 0)
