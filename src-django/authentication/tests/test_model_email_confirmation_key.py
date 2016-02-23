from api.tests.utils.factories import UserFactory
from authentication.models import EmailConfirmationKey
from django.test import TestCase
from freezegun import freeze_time
from nose.tools import assert_equals
import datetime


class EmailConfirmationKeyTest(TestCase):
    @freeze_time("2016-02-19")
    def test_create_from_user(self):
        user = UserFactory()
        email_confirmation_key = EmailConfirmationKey.create_from_user(user)

        assert_equals(email_confirmation_key.user, user)
        assert_equals(len(email_confirmation_key.key), 40)
        assert_equals(email_confirmation_key.expiration, datetime.datetime(2016, 2, 21))
