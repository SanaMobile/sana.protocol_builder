from django.test import TestCase, Client, override_settings
from django.contrib.auth.models import User
from django.core import mail
from django.core.cache import cache
from rest_framework import status
from rest_framework.authtoken.models import Token
from nose.tools import assert_equals, assert_not_equals, assert_true, assert_false, assert_is_none
from api.startup import grant_permissions
from utils.helpers import add_token_to_header
from utils import factories
from mock import patch
import json


@override_settings(
    CACHES={
        'default': {
            'BACKEND': 'django.core.cache.backends.locmem.LocMemCache',
        }
    },
    CELERY_EAGER_PROPAGATES_EXCEPTIONS=True,
    CELERY_ALWAYS_EAGER=True,
    BROKER_BACKEND='memory'
)
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
        self.reset_password_url = '/api/passwords/reset_password'
        self.reset_password_complete_url = '/api/passwords/reset_password_complete'
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
        json_response = json.loads(response.content)['user']
        for key in ['is_superuser', 'first_name', 'last_name', 'username', 'email']:
            assert_true(key in json_response)

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

    @patch('api.views.PasswordResetTokenGenerator.make_token')
    def test_reset_password(self, PasswordResetTokenGeneratorMock):
        data = {
            'email': self.user.email,
        }

        PasswordResetTokenGeneratorMock.return_value = 'abc'

        response = self.client.post(
            path=self.reset_password_url,
            data=json.dumps(data),
            content_type='application/json',
        )

        assert_equals(response.status_code, status.HTTP_201_CREATED)
        assert_equals(len(mail.outbox), 1)
        assert_equals(mail.outbox[0].subject, 'Reset Your Password')

        data = {
            'reset_token': 'abc',
            'new_password': self.new_password,
            'password_confirmation': self.new_password,
        }

        response = self.client.post(
            path=self.reset_password_complete_url,
            data=json.dumps(data),
            content_type='application/json'
        )

        assert_equals(response.status_code, status.HTTP_200_OK)
        assert_true(User.objects.get(pk=self.user.id).check_password(self.new_password))
        assert_is_none(cache.get(self.user.email))
