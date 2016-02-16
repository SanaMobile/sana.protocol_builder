from django.contrib.auth.models import User
from api import models
import factory


class UserFactory(factory.django.DjangoModelFactory):
    class Meta:
        model = User
        django_get_or_create = ('username',)

    username = 'TestUser'
    email = 'test@sanaprotocolbuilder.me'
    password = 'testpassword'


class ProcedureFactory(factory.django.DjangoModelFactory):
    class Meta:
        model = models.Procedure

    title = 'Sana Protocol Builder Procedure'
    author = 'John Smith'
    owner = factory.SubFactory(UserFactory)


class PageFactory(factory.django.DjangoModelFactory):
    class Meta:
        model = models.Page

    display_index = 0
    procedure = factory.SubFactory(ProcedureFactory)


class ConceptFactory(factory.django.DjangoModelFactory):
    class Meta:
        model = models.Concept

    name = 'SX SITE SWELLING'
    display_name = 'Swelling at surgical site'
    description = 'Swelling observed at surgical site post procedure'
    data_type = 'string'
    mime_type = 'text/plain'
    constraint = 'yes;no'


class ElementFactory(factory.django.DjangoModelFactory):
    class Meta:
        model = models.Element

    display_index = 0
    element_type = 'ENTRY'
    concept = factory.SubFactory(ConceptFactory)
    question = 'Where does it hurt?'
    eid = 'checkup_id'
    answer = ''
    page = factory.SubFactory(PageFactory)


class ShowIfFactory(factory.django.DjangoModelFactory):
    class Meta:
        model = models.ShowIf

    page = factory.SubFactory(PageFactory)


class CriteriaConditionFactory(factory.django.DjangoModelFactory):
    class Meta:
        model = models.ConditionNode

    parent = None
    criteria_element = factory.SubFactory(ElementFactory)
    node_type = 'CRITERIA'
    criteria_type = 'EQUALS'
    value = 'foot'


class AndConditionFactory(factory.django.DjangoModelFactory):
    class Meta:
        model = models.ConditionNode

    parent = None
    node_type = 'AND'


class OrConditionFactory(factory.django.DjangoModelFactory):
    class Meta:
        model = models.ConditionNode

    parent = None
    node_type = 'OR'


class NotConditionFactory(factory.django.DjangoModelFactory):
    class Meta:
        model = models.ConditionNode

    parent = None
    node_type = 'NOT'
