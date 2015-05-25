from django.test import TestCase
from django.contrib.auth.models import User
from django.core.exceptions import ObjectDoesNotExist
from rest_framework.authtoken.models import Token


class UserTest(TestCase):
    def setUp(self):
        self.test_user = User.objects.create_user('username', 'test@test.com', 'password')
        self.test_user.save()

    def test_user_has_token(self):
        try:
            token = Token.objects.get(user=self.test_user)
            self.assertFalse(token is None)
        except ObjectDoesNotExist:
            self.assertTrue(False)
