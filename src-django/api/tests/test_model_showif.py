from django.test import TestCase
from nose.tools import assert_equals, assert_not_equals
from api.models import ShowIf
from utils import factories


class ShowIfTest(TestCase):
    def test_create_showif(self):
        condition = factories.CriteriaConditionFactory()
        page = factories.PageFactory()

        ShowIf.objects.create(
            page=page,
            condition=condition
        )

        showif = ShowIf.objects.get(page=page)

        assert_equals(showif.page, page)
        assert_equals(showif.condition, condition)
        assert_not_equals(showif.last_modified, None)
        assert_not_equals(showif.created, None)

    def test_creates_complex_structure(self):
        root = factories.OrConditionFactory()
        showif = factories.ShowIfFactory(
            condition=root
        )
        lnode = factories.AndConditionFactory(
            parent=root
        )
        rnode = factories.AndConditionFactory(
            parent=root
        )

        for x in range(0, 3):
            factories.CriteriaConditionFactory(
                parent=lnode
            )

        factories.CriteriaConditionFactory(
            parent=factories.NotConditionFactory(
                parent=rnode
            )
        )

        factories.CriteriaConditionFactory(
            parent=rnode
        )

        showif_db = ShowIf.objects.get(pk=showif.id)
        condition = showif_db.condition
        assert_equals(condition, root)
        assert_equals(condition.children.count(), 2)

        left = condition.children.get(pk=lnode.id)
        assert_equals(left.children.count(), 3)

        right = condition.children.get(pk=rnode.id)
        assert_equals(right.children.count(), 2)

        not_node = right.children.get(node_type='NOT')
        assert_equals(not_node.children.count(), 1)
