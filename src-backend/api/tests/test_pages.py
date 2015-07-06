from django.test import TestCase, Client
from rest_framework import status
from rest_framework.authtoken.models import Token
from nose.tools import assert_equals, assert_false
from utils.decorators import add_group_permissions
from utils import factories, helpers
import json


class PageTest(TestCase):

    def setUp(self):
        self.client = Client()
        self.user = factories.UserFactory()
        self.procedure = factories.ProcedureFactory()
        self.page1 = factories.PageFactory(
            display_index=0,
            procedure=self.procedure
        )
        self.page2 = factories.PageFactory(
            display_index=1,
            procedure=self.procedure
        )
        self.page3 = factories.PageFactory(
            display_index=2,
            procedure=self.procedure
        )
        self.token = Token.objects.get(user=self.user)
        self.partial_bulk_url = '/api/pages/partial_bulk_update/'

    @add_group_permissions
    def test_page_reorder_back(self):
        data = [
            {
                'id': self.page1.id,
                'display_index': 1
            },
            {
                'id': self.page2.id,
                'display_index': 0
            },
            {
                'id': self.page3.id,
                'display_index': 2
            }
        ]

        response_patch = self.client.patch(
            path=self.partial_bulk_url,
            data=json.dumps(data),
            content_type='application/json',
            HTTP_AUTHORIZATION=helpers.add_token_to_header(self.token)
        )

        assert_equals(response_patch.status_code, status.HTTP_200_OK)
        json_resp = json.loads(response_patch.content)

        for page in json_resp:
            if page['id'] == self.page1.id:
                assert_equals(page['display_index'], 1)
            elif page['id'] == self.page2.id:
                assert_equals(page['display_index'], 0)
            elif page['id'] == self.page3.id:
                assert_equals(page['display_index'], 2)
            else:
                assert_false(True)

    @add_group_permissions
    def test_page_reorder_forward(self):
        data = [
            {
                'id': self.page1.id,
                'display_index': 0
            },
            {
                'id': self.page2.id,
                'display_index': 2
            },
            {
                'id': self.page3.id,
                'display_index': 1
            }
        ]

        response_patch = self.client.patch(
            path=self.partial_bulk_url,
            data=json.dumps(data),
            content_type='application/json',
            HTTP_AUTHORIZATION=helpers.add_token_to_header(self.token)
        )

        assert_equals(response_patch.status_code, status.HTTP_200_OK)
        json_resp = json.loads(response_patch.content)

        for page in json_resp:
            if page['id'] == self.page1.id:
                assert_equals(page['display_index'], 0)
            elif page['id'] == self.page2.id:
                assert_equals(page['display_index'], 2)
            elif page['id'] == self.page3.id:
                assert_equals(page['display_index'], 1)
            else:
                assert_false(True)


    @add_group_permissions
    def test_page_reorder_blank_data(self):
        data = []

        response_patch = self.client.patch(
            path=self.partial_bulk_url,
            data=json.dumps(data),
            content_type='application/json',
            HTTP_AUTHORIZATION=helpers.add_token_to_header(self.token)
        )

        assert_equals(response.status, status.HTTP_406_NOT_ACCEPTABLE)
