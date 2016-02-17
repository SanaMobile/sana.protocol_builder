from django.test import TestCase, Client
from django.contrib.auth.models import User
from rest_framework import status
from rest_framework.authtoken.models import Token
from nose.tools import assert_equals, assert_not_equals
from api.startup import grant_permissions
from utils.helpers import add_token_to_header
from utils import factories
import json


class UserTest(TestCase):

    def setUp(self):
        self.client = Client()
        self.token = Token.objects.get(user=factories.UserFactory())
        self.user_url = '/api/user'
        self.user = factories.UserFactory()
        self.new_email = 'foobar@email.com'
        self.new_password = 'hunter2'
        grant_permissions()

    def test_update_email(self):
        data = {
            'id': self.user.id,
            'email': self.new_email
        }
        url = "{url}/{pk}/update_details".format(url=self.user_url, pk=self.user.id)

        response = self.client.patch(
            path=url,
            data=json.dumps(data),
            content_type='application/json',
            HTTP_AUTHORIZATION=add_token_to_header(self.user, self.token)
        )

        assert_equals(response.status_code, status.HTTP_200_OK)
        assert_not_equals(self.user.email, self.new_email)
        assert_equals(User.objects.get(pk=self.user.id).email, self.new_email)

    def test_update_password(self):
        data = {
            'id': self.user.id,
            'password': self.new_password
        }
        url = "{url}/{pk}/update_details".format(url=self.user_url, pk=self.user.id)

        response = self.client.patch(
            path=url,
            data=json.dumps(data),
            content_type='application/json',
            HTTP_AUTHORIZATION=add_token_to_header(self.user, self.token)
        )

        assert_equals(response.status_code, status.HTTP_200_OK)
        assert_not_equals(self.user.password, self.new_password)
        assert_equals(User.objects.get(pk=self.user.id).password, self.new_password)

    def test_update_invalid_field(self):
        data = {
            'id': self.user.id,
            'username': 'johndoe'
        }
        url = "{url}/{pk}/update_details".format(url=self.user_url, pk=self.user.id)

        response = self.client.patch(
            path=url,
            data=json.dumps(data),
            content_type='application/json',
            HTTP_AUTHORIZATION=add_token_to_header(self.user, self.token)
        )

        assert_equals(response.status_code, status.HTTP_400_BAD_REQUEST)
        assert_equals(User.objects.get(pk=self.user.id), self.user)
