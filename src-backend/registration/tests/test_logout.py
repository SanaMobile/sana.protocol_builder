from django.test import TestCase, Client
from django.contrib.auth.models import User
from rest_framework.authtoken.models import Token


class LogoutTest(TestCase):
    def setUp(self):
        self.client = Client()

    def test_unauthenticated_user_cannot_logout(self):
        response = self.client.get('/auth/logout')
        self.assertEqual(response.status_code, 401)  # Not authorized

    def test_authenticated_user_can_logout(self):
        user = User.objects.create_user('username', 'test@test.com', 'password')
        user.save()

        token = Token.objects.get(user=user)
        response_get = self.client.get('/auth/logout', HTTP_AUTHORIZATION='Token ' + token.key)
        response_post = self.client.post('/auth/logout', HTTP_AUTHORIZATION='Token ' + token.key)

        self.assertEqual(response_get.status_code, 405)  # Method not allowed
        self.assertEqual(response_post.status_code, 200)
