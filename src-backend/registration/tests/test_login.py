from django.test import TestCase, Client
from django.contrib.auth.models import User
from rest_framework.authtoken.models import Token
import json


class LoginTest(TestCase):
    def setUp(self):
        self.client = Client()

    def test_invalid_method_cannot_login(self):
        response = self.client.get('/auth/login')
        self.assertEqual(response.status_code, 405)  # Method not allowed

    def test_invalid_user_cannot_login(self):
        response = self.client.post('/auth/login', {'username': 'root', 'password': 'hunter2'})
        self.assertEqual(response.status_code, 200)

        # Check json response
        r = json.loads(response.content)
        self.assertFalse(r['success'])
        self.assertTrue(r['token'] is None)
        self.assertTrue(len(r['errors']) > 0)

    def test_valid_user_can_login(self):
        username = 'admin'
        password = 'admin'

        user = User.objects.create_user(username, 'test@test.com', password)
        user.save()

        response = self.client.post('/auth/login', {'username': username, 'password': password})
        self.assertEqual(response.status_code, 200)

        # Check json response
        r = json.loads(response.content)
        self.assertTrue(r['success'])
        self.assertTrue(r['token'] is not None)
        self.assertEqual(r['token'], Token.objects.get(user=user).key)
        self.assertEqual(len(r['errors']), 0)
