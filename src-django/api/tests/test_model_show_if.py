from django.test import TestCase
from nose.tools import assert_equals, assert_not_equals
from api.models import ShowIf
from utils import factories


class ShowIfTest(TestCase):
    def test_create_showif(self):
        page = factories.PageFactory()

        show_if = ShowIf.objects.create(
            page=page
        )

        condition = factories.CriteriaConditionFactory(
            show_if=show_if
        )

        show_if = ShowIf.objects.get(page=page)

        assert_equals(show_if.page, page)
        assert_equals(show_if.conditions.count(), 1)
        assert_equals(show_if.conditions.all()[0], condition)
        assert_not_equals(show_if.last_modified, None)
        assert_not_equals(show_if.created, None)

    def test_creates_complex_structure(self):
        show_if = factories.ShowIfFactory()
        root = factories.OrConditionFactory(
            show_if=show_if
        )

        lnode = factories.AndConditionFactory(
            show_if=None,
            parent=root
        )
        rnode = factories.AndConditionFactory(
            show_if=None,
            parent=root
        )

        for x in range(0, 3):
            factories.CriteriaConditionFactory(
                show_if=None,
                parent=lnode
            )

        factories.CriteriaConditionFactory(
            show_if=None,
            parent=factories.NotConditionFactory(
                show_if=None,
                parent=rnode
            )
        )

        factories.CriteriaConditionFactory(
            show_if=None,
            parent=rnode
        )

        showif_db = ShowIf.objects.get(pk=show_if.id)
        condition = showif_db.conditions.all()[0]
        assert_equals(condition, root)
        assert_equals(condition.children.count(), 2)

        left = condition.children.get(pk=lnode.id)
        assert_equals(left.children.count(), 3)

        right = condition.children.get(pk=rnode.id)
        assert_equals(right.children.count(), 2)

        not_node = right.children.get(node_type='NOT')
        assert_equals(not_node.children.count(), 1)
