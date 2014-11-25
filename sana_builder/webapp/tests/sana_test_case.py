from django.test import TestCase
from django.contrib.auth.models import User
from webapp.models import *

class SanaTestCase(TestCase):
    def setUp(self):
        self.test_user = User.objects.create_user('TestUser', 'test@sanaprotocolbuilder.me', 'testpassword')
        self.test_user.save()

        self.test_procedure = Procedure.objects.create(author='tester', title='test procedure', owner=self.test_user)
        self.test_procedure.save()

        self.test_page = Page.objects.create(page_order=0, procedure=self.test_procedure)
