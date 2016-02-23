from django.test import TestCase, Client
from nose.tools import assert_equals, assert_true, assert_false, assert_raises
from authentication.models import EmailConfirmationKey
from utils import factories
from rest_framework import status
import datetime
import json


class ConfirmEmailTest(TestCase):
    def setUp(self):
        self.client = Client()

    def test_valid_key(self):
        email_confirmation_key = factories.EmailConfirmationKeyFactory()
        response = self.client.get('/auth/confirm_email/{0}'.format(email_confirmation_key.key))
        assert_equals(response.status_code, status.HTTP_200_OK)

        r = json.loads(response.content)
        assert_true(r['success'])

    def test_invalid_key(self):
        response = self.client.get('/auth/confirm_email/asdfghjkl')
        assert_equals(response.status_code, status.HTTP_404_NOT_FOUND)

    def test_expired_key(self):
        email_confirmation_key = factories.EmailConfirmationKeyFactory(
            expiration=(datetime.datetime.today() + datetime.timedelta(-3))
        )
        response = self.client.get('/auth/confirm_email/{0}'.format(email_confirmation_key.key))

        assert_equals(response.status_code, status.HTTP_400_BAD_REQUEST)

    def test_user_becomes_confirmed(self):
        user_profile = factories.UserProfileFactory()
        email_confirmation_key = factories.EmailConfirmationKeyFactory(user=user_profile.user)

        assert_false(user_profile.is_email_confirmed)

        response = self.client.get('/auth/confirm_email/{0}'.format(email_confirmation_key.key))
        assert_equals(response.status_code, status.HTTP_200_OK)

        user_profile.refresh_from_db()
        assert_true(user_profile.is_email_confirmed)

    def test_key_is_deleted(self):
        email_confirmation_key = factories.EmailConfirmationKeyFactory()
        response = self.client.get('/auth/confirm_email/{0}'.format(email_confirmation_key.key))
        assert_equals(response.status_code, status.HTTP_200_OK)

        assert_raises(
            EmailConfirmationKey.DoesNotExist, EmailConfirmationKey.objects.get, key=email_confirmation_key.key
        )
