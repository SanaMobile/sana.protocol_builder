from django.test import TestCase, Client
from django.contrib.auth.models import User
from rest_framework.authtoken.models import Token
from rest_framework import status
from utils.helpers import add_token_to_header
from nose.tools import assert_equals, assert_is_none
from utils import factories
from api.startup import grant_permissions
from api.models import MDSInstance, Procedure
from api.views import MDSInstanceViewSet
from mock import patch
import json


class MockResponse:
    def __init__(self, status_code, body):
        self.status_code = status_code
        self.body = body


class AttemptLoginToMDSTest(TestCase):

    MDS_URL = 'https://www.yourMdsUrl.com/'
    MDS_USERNAME = 'test_username'
    MDS_PASSWORD = 'test_password'
    MDS_LOGIN_DATA = {
        'api_url': MDS_URL,
        'username': MDS_USERNAME,
        'password': MDS_PASSWORD,
    }
    MDS_API_KEY = 'test_mds_api_key'
    LOGIN_TO_MDS_URL = '/api/mdsInstance/attempt_login'

    def setUp(self):
        self.client = Client()
        self.user = factories.UserFactory()
        self.token = Token.objects.get(user=self.user)
        grant_permissions()

    def test_attempt_login_with_incomplete_data(self):
        empty_data = {}
        response = self.client.post(
            path=self.LOGIN_TO_MDS_URL,
            data=json.dumps(empty_data),
            content_type='application/json',
            HTTP_AUTHORIZATION=add_token_to_header(self.user, self.token),
        )
        assert_equals(response.status_code, status.HTTP_400_BAD_REQUEST)

        data_with_no_user = {'api_url': self.MDS_URL}
        response = self.client.post(
            path=self.LOGIN_TO_MDS_URL,
            data=json.dumps(data_with_no_user),
            content_type='application/json',
            HTTP_AUTHORIZATION=add_token_to_header(self.user, self.token),
        )
        assert_equals(response.status_code, status.HTTP_400_BAD_REQUEST)

        data_with_no_url = {
            'username': self.MDS_USERNAME,
            'password': self.MDS_PASSWORD,
        }
        response = self.client.post(
            path=self.LOGIN_TO_MDS_URL,
            data=json.dumps(data_with_no_url),
            content_type='application/json',
            HTTP_AUTHORIZATION=add_token_to_header(self.user, self.token),
        )
        assert_equals(response.status_code, status.HTTP_400_BAD_REQUEST)

    @patch('api.views.requests.post')
    def test_attempt_login_to_mds_success_response(self, mock_post):
        mock_post.return_value = MockResponse(
            status.HTTP_200_OK,
            {'api_key': self.MDS_API_KEY},
        )

        response = self.client.post(
            path=self.LOGIN_TO_MDS_URL,
            data=json.dumps(self.MDS_LOGIN_DATA),
            content_type='application/json',
            HTTP_AUTHORIZATION=add_token_to_header(self.user, self.token),
        )

        mock_post.assert_called_with(
            self.MDS_URL + 'login/',
            data={
                'username': self.MDS_USERNAME,
                'password': self.MDS_PASSWORD,
            },
        )
        assert_equals(response.status_code, status.HTTP_200_OK)
        assert_equals(response.data, {
            'mds_status_code': status.HTTP_200_OK,
            'mds_instance': {
                'api_url': self.MDS_URL,
                'api_key': self.MDS_API_KEY,
            },
        })

        # Confirm MDS instance created
        mds_instance = MDSInstance.objects.get(user=self.user)
        assert_equals(mds_instance.user, self.user)
        assert_equals(mds_instance.api_url, self.MDS_URL)
        assert_equals(mds_instance.api_key, self.MDS_API_KEY)

    @patch('api.views.requests.post')
    def test_attempt_login_to_mds_failed_response(self, mock_post):
        mock_post.return_value = MockResponse(status.HTTP_404_NOT_FOUND, {})

        response = self.client.post(
            path=self.LOGIN_TO_MDS_URL,
            data=json.dumps(self.MDS_LOGIN_DATA),
            content_type='application/json',
            HTTP_AUTHORIZATION=add_token_to_header(self.user, self.token),
        )

        mock_post.assert_called_with(
            self.MDS_URL + 'login/',
            data={
                'username': self.MDS_USERNAME,
                'password': self.MDS_PASSWORD,
            },
        )
        assert_equals(response.status_code, status.HTTP_200_OK)
        assert_equals(response.data, {
            'mds_status_code': status.HTTP_404_NOT_FOUND,
        })

        # Confirm MDS instance empty
        mds_instance = MDSInstance.objects.get(user=self.user)
        assert_is_none(mds_instance.api_url)
        assert_is_none(mds_instance.api_key)


class AttemptPushToMDSTest(TestCase):

    PUSH_TO_MDS_URL = '/api/mdsInstance/push_to_mds'
    TEST_PROCEDURE_XML = '<testtag></testtag>'
    TEST_PROCEDURE_VERSION = 3

    def setUp(self):
        self.client = Client()
        self.user = factories.UserFactory()
        self.token = Token.objects.get(user=self.user)
        grant_permissions()

    def test_attempt_push_to_mds_with_incomplete_data(self):
        empty_data = {}
        response = self.client.post(
            path=self.PUSH_TO_MDS_URL,
            data=json.dumps(empty_data),
            content_type='application/json',
            HTTP_AUTHORIZATION=add_token_to_header(self.user, self.token),
        )
        assert_equals(response.status_code, status.HTTP_400_BAD_REQUEST)

    def test_attempt_push_to_mds_with_no_mds_instance(self):
        procedure = factories.ProcedureFactory()
        data = {'procedure_id': procedure.id}
        response = self.client.post(
            path=self.PUSH_TO_MDS_URL,
            data=json.dumps(data),
            content_type='application/json',
            HTTP_AUTHORIZATION=add_token_to_header(self.user, self.token),
        )
        assert_equals(response.status_code, status.HTTP_400_BAD_REQUEST)

    def test_attempt_push_to_mds_unowned_procedure(self):
        factories.MDSInstanceFactory(user_id=self.user.id)
        other_user = User.objects.create_user(
            username='test_username',
            email='test@test.com',
            password='test_password',
        )
        unowned_procedure = Procedure.objects.create(
            author='test user',
            title='Procedure I do not own',
            owner=other_user,
        )

        data = {'procedure_id': unowned_procedure.id}
        response = self.client.post(
            path=self.PUSH_TO_MDS_URL,
            data=json.dumps(data),
            content_type='application/json',
            HTTP_AUTHORIZATION=add_token_to_header(self.user, self.token),
        )
        assert_equals(response.status_code, status.HTTP_403_FORBIDDEN)

    @patch('api.generator.ProtocolBuilder.generate')
    @patch('api.views.requests.post')
    def test_attempt_push_to_mds_success_response(
        self,
        mock_post,
        mock_protocol_generator,
    ):
        mock_post.return_value = MockResponse(
            status.HTTP_200_OK,
            {},
        )
        mock_protocol_generator.return_value = self.TEST_PROCEDURE_XML

        mds_instance = factories.MDSInstanceFactory(user_id=self.user.id)
        procedure = factories.ProcedureFactory(
            version=self.TEST_PROCEDURE_VERSION
        )
        data = {'procedure_id': procedure.id}
        response = self.client.post(
            path=self.PUSH_TO_MDS_URL,
            data=json.dumps(data),
            content_type='application/json',
            HTTP_AUTHORIZATION=add_token_to_header(self.user, self.token),
        )

        mock_protocol_generator.assert_called_with(self.user, procedure.id)
        mock_post.assert_called_with(
            mds_instance.api_url + 'push_protocol/',
            data={
                'procedure_xml': self.TEST_PROCEDURE_XML,
                'procedure_version': self.TEST_PROCEDURE_VERSION,
            },
        )
        assert_equals(response.status_code, status.HTTP_200_OK)
        assert_equals(response.data, {
            'mds_status_code': status.HTTP_200_OK,
        })


class UtilsTest(TestCase):

    URL_WITHOUT_SLASH = 'https://www.yourMdsUrl.com'
    URL_WITH_SLASH = 'https://www.yourMdsUrl.com/'
    ENDPOINT = 'test_endpoint/'

    def test_get_mds_url(self):
        url = MDSInstanceViewSet.get_mds_url(
            self.URL_WITHOUT_SLASH,
            self.ENDPOINT,
        )
        assert_equals(url, self.URL_WITH_SLASH + self.ENDPOINT)

        url = MDSInstanceViewSet.get_mds_url(
            self.URL_WITH_SLASH,
            self.ENDPOINT,
        )
        assert_equals(url, self.URL_WITH_SLASH + self.ENDPOINT)
