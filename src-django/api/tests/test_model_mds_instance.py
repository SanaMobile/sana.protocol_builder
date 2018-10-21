from django.test import TestCase
from django.db import IntegrityError
from api.models import MDSInstance
from utils import factories
from nose.tools import assert_equals, raises


class MDSInstanceTest(TestCase):

    MDS_URL = 'https://www.yourMdsUrl.com/'
    MDS_API_KEY = 'test_mds_api_key'

    def setUp(self):
        self.user = factories.UserFactory()

    def test_create_mds_instance(self):
        mds_instance = MDSInstance.objects.create(
            api_url=self.MDS_URL,
            api_key=self.MDS_API_KEY,
            user_id=self.user.id,
        )

        assert_equals(mds_instance.api_url, self.MDS_URL)
        assert_equals(mds_instance.api_key, self.MDS_API_KEY)
        assert_equals(mds_instance.user_id, self.user.id)

    @raises(IntegrityError)
    def test_create_mds_instance_without_userid(self):
        MDSInstance.objects.create(
            api_url=self.MDS_URL,
            api_key=self.MDS_API_KEY,
        )

    @raises(IntegrityError)
    def test_create_multiple_mds_instances(self):
        for _ in range(2):
            MDSInstance.objects.create(
                api_url=self.MDS_URL,
                api_key=self.MDS_API_KEY,
                user_id=self.user.id,
            )
