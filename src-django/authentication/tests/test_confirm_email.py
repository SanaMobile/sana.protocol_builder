from api.tests.utils.factories import UserFactory
from authentication.views import EMAIL_CONFIRMATION_KEY_TTL_DAYS
from django.core.cache import cache
from django.test import TestCase, Client
from django.test.utils import override_settings
from nose.tools import assert_equals, assert_true, assert_false, assert_is_none
from utils import factories
from rest_framework import status
import datetime
import json


@override_settings(CACHES={
    'default': {
        'BACKEND': 'django.core.cache.backends.locmem.LocMemCache',
    }
})
class ConfirmEmailTest(TestCase):
    def setUp(self):
        self.client = Client()

        self.testUser = UserFactory()
        self.testKey = '84bff1c64351a616828596f01b4e0d3155190eb5'
        self.testTimeout = datetime.timedelta(EMAIL_CONFIRMATION_KEY_TTL_DAYS).total_seconds()

    def test_valid_key(self):
        cache.set(self.testKey, self.testUser.pk, self.testTimeout)
        response = self.client.get('/auth/confirm_email/{0}'.format(self.testKey))
        assert_equals(response.status_code, status.HTTP_200_OK)

        r = json.loads(response.content)
        assert_true(r['success'])

    def test_invalid_key(self):
        response = self.client.get('/auth/confirm_email/asdfghjkl')
        assert_equals(response.status_code, status.HTTP_404_NOT_FOUND)

    def test_user_becomes_confirmed(self):
        user_profile = factories.UserProfileFactory(user=self.testUser)
        cache.set(self.testKey, self.testUser.pk, self.testTimeout)

        assert_false(user_profile.is_email_confirmed)

        response = self.client.get('/auth/confirm_email/{0}'.format(self.testKey))
        assert_equals(response.status_code, status.HTTP_200_OK)

        user_profile.refresh_from_db()
        assert_true(user_profile.is_email_confirmed)

    def test_key_is_deleted(self):
        cache.set(self.testKey, self.testUser.pk, self.testTimeout)
        response = self.client.get('/auth/confirm_email/{0}'.format(self.testKey))
        assert_equals(response.status_code, status.HTTP_200_OK)

        assert_is_none(cache.get(self.testKey))
