from authentication.models import UserProfile
from django.test import TestCase
from django.contrib.auth.models import User
from rest_framework.authtoken.models import Token
from nose.tools import assert_is_not_none


class UserTest(TestCase):
    def setUp(self):
        self.test_user = User.objects.create_user('username', 'test@test.com', 'password')
        self.test_user.save()

    def test_user_profile_is_created(self):
        user_profile = UserProfile.objects.get(user=self.test_user)
        assert_is_not_none(user_profile)

    def test_user_has_token(self):
        token = Token.objects.get(user=self.test_user)
        assert_is_not_none(token)
