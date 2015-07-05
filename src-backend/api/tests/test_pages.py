from django.test import TestCase, Client, SimpleTestCase
from rest_framework import status
from rest_framework.authtoken.models import Token
from nose.tools import assert_equals
from api.models import User, Page, Procedure
from utils.decorators import add_group_permissions
import json


class PageTest(TestCase):

    def setUp(self):
        self.client = Client()
        self.user = User.objects.create_user(
                    'admin',
                    'test@email.com',
                    'password'
                )
        self.procedure = Procedure.objects.create(
                    author='tester',
                    title='test procedure',
                    owner=self.user
                )
        self.page1 = Page.objects.create(
                    display_index=0,
                    procedure=self.procedure
                )
        self.page2 = Page.objects.create(
                    display_index=1,
                    procedure=self.procedure
                )
        self.page3 = Page.objects.create(
                    display_index=2,
                    procedure=self.procedure
                )

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

        token = Token.objects.get(user=self.user)

        response_patch = self.client.patch(
                        path='/api/pages/partial_bulk_update/',
                        data=json.dumps(data),
                        content_type='application/json',
                        HTTP_AUTHORIZATION='Token ' + token.key)

        assert_equals(response_patch.status_code, status.HTTP_200_OK)
        json_resp = json.loads(response_patch.content)

        for page in json_resp:
            if page['id'] == self.page1.id:
                assert_equals(page['display_index'], 1)
            elif page['id'] == self.page2.id:
                assert_equals(page['display_index'], 0)
            elif page['id'] == self.page3.id:
                assert_equals(page['display_index'], 2)

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

        token = Token.objects.get(user=self.user)

        response_patch = self.client.patch(
                        path='/api/pages/partial_bulk_update/',
                        data=json.dumps(data),
                        content_type='application/json',
                        HTTP_AUTHORIZATION='Token ' + token.key)

        assert_equals(response_patch.status_code, status.HTTP_200_OK)
        json_resp = json.loads(response_patch.content)

        for page in json_resp:
            if page['id'] == self.page1.id:
                assert_equals(page['display_index'], 0)
            elif page['id'] == self.page2.id:
                assert_equals(page['display_index'], 2)
            elif page['id'] == self.page3.id:
                assert_equals(page['display_index'], 1)
