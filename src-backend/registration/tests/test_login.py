from django.test import TestCase, Client
from django.contrib.auth.models import User
from rest_framework.authtoken.models import Token
from rest_framework import status
from nose.tools import assert_equals, assert_true, assert_false
import json


class LoginTest(TestCase):
    def setUp(self):
        self.client = Client()

    def test_invalid_method_cannot_login(self):
        response = self.client.get('/auth/login')
        assert_equals(response.status_code, status.HTTP_405_METHOD_NOT_ALLOWED)

    def test_invalid_user_cannot_login(self):
        response = self.client.post('/auth/login', {'username': 'root', 'password': 'hunter2'})
        assert_equals(response.status_code, status.HTTP_200_OK)

        # Check json response
        r = json.loads(response.content)
        assert_false(r['success'])
        assert_true(r['token'] is None)
        assert_true(len(r['errors']) > 0)

    def test_valid_user_can_login(self):
        username = 'admin'
        password = 'admin'

        user = User.objects.create_user(username, 'test@test.com', password)
        user.save()

        response = self.client.post('/auth/login', {'username': username, 'password': password})
        assert_equals(response.status_code, status.HTTP_200_OK)

        # Check json response
        r = json.loads(response.content)
        assert_true(r['success'])
        assert_true(r['token'] is not None)
        assert_equals(r['token'], Token.objects.get(user=user).key)
        assert_equals(len(r['errors']), 0)
