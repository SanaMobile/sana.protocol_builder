from django.db import models
from django.contrib.auth.models import User


class Procedure(models.Model):
    title = models.CharField(max_length=255)
    author = models.CharField(max_length=255)
    version = models.CharField(max_length=255, null=True)
    uuid = models.CharField(max_length=36, null=True)
    owner = models.OneToOneField(User)


class Page(models.Model):
    display_index = models.IntegerField()
    procedure = models.ForeignKey(Procedure, related_name='pages')

    class Meta:
        unique_together = (
            ('display_index', 'procedure')
        )


class Element(models.Model):
    display_index = models.IntegerField()
    eid = models.CharField(max_length=255)
    concept = models.TextField()
    question = models.TextField()
    default_answer = models.TextField()
    page = models.ForeignKey(Page, related_name='elements')

    class Meta:
        unique_together = (
            ('display_index', 'page')
        )


class EntryElement(models.Model):
    numeric = models.CharField(max_length=255, null=True)


class ChoiceElement(Element):
    TYPES = (
        ('SELECT', 'SELECT'),
        ('MULTI_SELECT', 'MULTI_SELECT'),
        ('RADIO', 'RADIO')
    )
    element_type = models.CharField(max_length=12, choices=TYPES)
    choices = models.TextField()


class SingleValueElement(Element):
    TYPES = (
        ('GPS', 'GPS'),
        ('SOUND', 'SOUND'),
        ('PICTURE', 'PICTURE')
    )
    element_type = models.CharField(max_length=12, choices=TYPES)
