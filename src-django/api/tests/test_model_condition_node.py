from django.test import TestCase
from django.db import IntegrityError
from nose.tools import raises, assert_equals, assert_is_not_none
from api.models import ConditionNode
from utils import factories


class ConditionTest(TestCase):
    @raises(IntegrityError)
    def test_invalid_node_type(self):
        ConditionNode.objects.create(
            node_type='foo',
            parent=factories.NotConditionFactory()
        )

    @raises(IntegrityError)
    def test_no_parent_or_show_if(self):
        ConditionNode.objects.create(
            node_type='NOT'
        )

    @raises(IntegrityError)
    def test_both_show_if_and_parent(self):
        ConditionNode.objects.create(
            node_type='NOT',
            parent=factories.NotConditionFactory(),
            show_if=factories.ShowIfFactory()
        )

    @raises(IntegrityError)
    def test_no_criteria_type(self):
        ConditionNode.objects.create(
            node_type='CRITERIA',
            criteria_type=None,
            criteria_element=factories.ElementFactory(),
            parent=factories.NotConditionFactory()
        )

    @raises(IntegrityError)
    def test_invalid_criteria_type(self):
        ConditionNode.objects.create(
            node_type='CRITERIA',
            criteria_type='foo',
            criteria_element=factories.ElementFactory(),
            parent=factories.NotConditionFactory()
        )

    @raises(IntegrityError)
    def test_criteria_has_no_element(self):
        ConditionNode.objects.create(
            node_type='CRITERIA',
            criteria_type='EQUALS',
            criteria_element=None,
            parent=factories.NotConditionFactory()
        )

    def test_creates_and_condition(self):
        show_if = factories.ShowIfFactory()
        ConditionNode.objects.create(
            node_type='AND',
            show_if=show_if
        )

        condition = ConditionNode.objects.get(node_type='AND')

        assert_equals(condition.node_type, 'AND')
        assert_equals(condition.show_if, show_if)
        assert_is_not_none(condition.last_modified)
        assert_is_not_none(condition.created)

    def test_creates_or_condition(self):
        show_if = factories.ShowIfFactory()
        ConditionNode.objects.create(
            node_type='OR',
            show_if=show_if
        )

        condition = ConditionNode.objects.get(node_type='OR')

        assert_equals(condition.node_type, 'OR')
        assert_equals(condition.show_if, show_if)
        assert_is_not_none(condition.last_modified)
        assert_is_not_none(condition.created)

    def test_creates_not_condition(self):
        show_if = factories.ShowIfFactory()
        ConditionNode.objects.create(
            node_type='NOT',
            show_if=show_if
        )

        condition = ConditionNode.objects.get(node_type='NOT')

        assert_equals(condition.node_type, 'NOT')
        assert_equals(condition.show_if, show_if)
        assert_is_not_none(condition.last_modified)
        assert_is_not_none(condition.created)

    def test_creates_criteria_equals_condition(self):
        self.assert_creates_criteria('EQUALS')

    def test_creates_criteria_greater_condition(self):
        self.assert_creates_criteria('GREATER')

    def test_creates_criteria_less_condition(self):
        self.assert_creates_criteria('LESS')

    def test_creates_simple_and(self):
        root = factories.AndConditionFactory(
            show_if=factories.ShowIfFactory()
        )
        factories.CriteriaConditionFactory(
            show_if=None,
            parent=root
        )
        factories.CriteriaConditionFactory(
            show_if=None,
            parent=root
        )

        condition = ConditionNode.objects.get(pk=root.id)

        assert_equals(condition.children.count(), 2)

    def test_creates_simple_or(self):
        root = factories.OrConditionFactory(
            show_if=factories.ShowIfFactory()
        )
        factories.CriteriaConditionFactory(
            show_if=None,
            parent=root
        )
        factories.CriteriaConditionFactory(
            show_if=None,
            parent=root
        )

        condition = ConditionNode.objects.get(pk=root.id)

        assert_equals(condition.children.count(), 2)

    def test_creates_simple_not(self):
        root = factories.NotConditionFactory(
            show_if=factories.ShowIfFactory()
        )
        factories.CriteriaConditionFactory(
            show_if=None,
            parent=root
        )

        condition = ConditionNode.objects.get(pk=root.id)

        assert_equals(condition.children.count(), 1)

    def test_creates_complex_structure(self):
        root = factories.OrConditionFactory(
            show_if=factories.ShowIfFactory()
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
            parent=factories.NotConditionFactory(
                show_if=None,
                parent=rnode
            ),
            show_if=None
        )

        factories.CriteriaConditionFactory(
            parent=rnode,
            show_if=None
        )

        condition = ConditionNode.objects.get(pk=root.id)
        assert_equals(condition.children.count(), 2)

        left = condition.children.get(pk=lnode.id)
        assert_equals(left.children.count(), 3)

        right = condition.children.get(pk=rnode.id)
        assert_equals(right.children.count(), 2)

        not_node = right.children.get(node_type='NOT')
        assert_equals(not_node.children.count(), 1)

    # HELPERS

    def assert_creates_criteria(self, criteria_type):
        element = factories.ElementFactory()
        show_if = factories.ShowIfFactory()
        ConditionNode.objects.create(
            node_type='CRITERIA',
            criteria_element=element,
            criteria_type=criteria_type,
            value='value',
            show_if=show_if
        )

        condition = ConditionNode.objects.get(value='value')

        assert_equals(condition.node_type, 'CRITERIA')
        assert_equals(condition.criteria_element, element)
        assert_equals(condition.criteria_type, criteria_type)
        assert_equals(condition.value, 'value')
        assert_equals(condition.show_if, show_if)
        assert_is_not_none(condition.last_modified)
        assert_is_not_none(condition.created)
