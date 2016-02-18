from django.test import TestCase, Client
from django.contrib.auth.models import User
from rest_framework import status
from rest_framework.authtoken.models import Token
from nose.tools import assert_equals, assert_not_equals, assert_true, assert_false
from api.startup import grant_permissions
from utils.helpers import add_token_to_header
from utils import factories
import json


class UserTest(TestCase):

    def setUp(self):
        self.client = Client()
        self.token = Token.objects.get(user=factories.UserFactory())
        self.url = '/api/users/update_details'
        self.user = factories.UserFactory()
        self.new_email = 'foobar@email.com'
        self.new_password = 'hunter2'
        self.current_password = 'testpassword'
        self.user.set_password(self.current_password)
        self.user.save()
        grant_permissions()

    def test_update_email(self):
        data = {
            'id': self.user.id,
            'email': self.new_email,
            'auth': str(self.token),
            'current-password': self.current_password,
        }

        response = self.client.patch(
            path=self.url,
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
            'password': self.new_password,
            'auth': str(self.token),
            'current-password': self.current_password,
        }

        response = self.client.patch(
            path=self.url,
            data=json.dumps(data),
            content_type='application/json',
            HTTP_AUTHORIZATION=add_token_to_header(self.user, self.token)
        )

        assert_equals(response.status_code, status.HTTP_200_OK)
        assert_false(self.user.check_password(self.new_password))
        assert_true(User.objects.get(pk=self.user.id).check_password(self.new_password))

    def test_update_missing_field(self):
        data = {
            'id': self.user.id,
            'username': 'johndoe',
            'auth': str(self.token),
        }

        response = self.client.patch(
            path=self.url,
            data=json.dumps(data),
            content_type='application/json',
            HTTP_AUTHORIZATION=add_token_to_header(self.user, self.token)
        )

        assert_equals(response.status_code, status.HTTP_400_BAD_REQUEST)
        assert_equals(User.objects.get(pk=self.user.id), self.user)
