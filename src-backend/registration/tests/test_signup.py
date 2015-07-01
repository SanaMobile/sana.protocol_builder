from django.test import TestCase, Client
import json


class SignupTest(TestCase):
    def setUp(self):
        self.client = Client()

    def test_new_user_can_signup(self):
        fields = {
            'username': 'admin',
            'email': 'admin@admin.com',
            'password1': 'admin',
            'password2': 'admin',
            'accept_tos': True
        }

        response = self.client.post('/auth/signup', fields)
        self.assertEqual(response.status_code, 200)

        r = json.loads(response.content)
        self.assertTrue(r['success'])
        self.assertTrue(r['token'] is not None)
        self.assertEqual(len(r['errors']), 0)
