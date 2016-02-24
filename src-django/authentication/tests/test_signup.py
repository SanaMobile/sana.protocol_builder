from django.contrib.auth.models import User
from django.core import mail
from django.core.cache import cache
from django.test import TestCase, Client
from django.test.utils import override_settings
from mock import patch
from nose.tools import assert_equals, assert_true, assert_false
from rest_framework import status
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
class SignupTest(TestCase):
    def setUp(self):
        self.client = Client()
        self.valid_fields = {
            'username': 'admin',
            'email': 'admin@admin.com',
            'password1': 'admin',
            'password2': 'admin',
            'accept_tos': True
        }

    def test_new_user_can_signup(self):
        response = self.client.post('/auth/signup', self.valid_fields)
        assert_equals(response.status_code, status.HTTP_200_OK)

        r = json.loads(response.content)
        assert_true(r['success'])
        assert_true(r['token'] is not None)
        assert_equals(len(r['errors']), 0)

    def test_new_user_is_unconfirmed(self):
        response = self.client.post('/auth/signup', self.valid_fields)
        assert_equals(response.status_code, status.HTTP_200_OK)

        user = User.objects.get(username='admin')
        assert_false(user.profile.is_email_confirmed)

    @patch('authentication.views._generateEmailConfirmationKey')
    def test_email_confirmation_key_is_created(self, _generateEmailConfirmationKeyMock):
        _generateEmailConfirmationKeyMock.return_value = 'abc'
        response = self.client.post('/auth/signup', self.valid_fields)
        assert_equals(response.status_code, status.HTTP_200_OK)

        user = User.objects.get(username='admin')
        assert_equals(cache.get('abc'), user.pk)

    def test_email_is_sent(self):
        response = self.client.post('/auth/signup', self.valid_fields)
        assert_equals(response.status_code, status.HTTP_200_OK)

        assert_equals(len(mail.outbox), 1)
        assert_equals(mail.outbox[0].subject, "Account Confirmation for Sana Protocol Builder")
