from django.test import TestCase
from nose.tools import assert_equals, assert_not_equals
from api.models import ShowIf
from utils import factories
import json


class ShowIfTest(TestCase):
    def test_create_showif(self):
        page = factories.PageFactory()
        element = factories.ElementFactory()

        conditions = json.dumps({
            'node_type': 'NOT',
            'children': [
                {
                    'node_type': 'AND',
                    'children': [
                        {
                            'criteria_element': element.pk,
                            'node_type': 'EQUALS',
                            'value': 'foo'
                        },
                        {
                            'criteria_element': element.pk,
                            'node_type': 'LESS',
                            'value': 'bar'
                        }
                    ]
                }
            ]
        })
        ShowIf.objects.create(page=page, conditions=conditions)

        show_if = ShowIf.objects.get(page=page)

        assert_equals(show_if.page, page)
        assert_equals(show_if.conditions, conditions)
        assert_not_equals(show_if.last_modified, None)
        assert_not_equals(show_if.created, None)
