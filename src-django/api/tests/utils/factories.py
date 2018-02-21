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
    answer = '[]'
    page = factory.SubFactory(PageFactory)


class AbstractElementFactory(factory.django.DjangoModelFactory):
    class Meta:
        model = models.AbstractElement

    display_index = 0
    element_type = 'ENTRY'
    concept = factory.SubFactory(ConceptFactory)
    question = 'Where does it hurt?'
    answer = '[]'


class ChoiceElementFactory(factory.django.DjangoModelFactory):
    class Meta:
        model = models.Element

    display_index = 0
    element_type = 'SELECT'
    concept = factory.SubFactory(ConceptFactory)
    question = 'Where does it hurt?'
    answer = ''
    choices = '[one, two, three]'
    page = factory.SubFactory(PageFactory)


class PluginElementFactory(factory.django.DjangoModelFactory):
    class Meta:
        model = models.Element

    display_index = 0
    element_type = 'PLUGIN'
    concept = factory.SubFactory(ConceptFactory)
    question = 'Where does it hurt?'
    answer = ''
    action = 'fire the laser',
    mime_type = 'text/javascript'
    page = factory.SubFactory(PageFactory)


class ShowIfFactory(factory.django.DjangoModelFactory):
    class Meta:
        model = models.ShowIf

    page = factory.SubFactory(PageFactory)
    conditions = ""
