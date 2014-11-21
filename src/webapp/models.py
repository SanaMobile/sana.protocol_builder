from django.db import models
from django.contrib.auth.models import User

from signals import user_post_save

class Procedure(models.Model):
    title = models.CharField(max_length=255)
    author = models.CharField(max_length=255)
    version = models.CharField(max_length=255)
    owner = models.ForeignKey(User, unique=True)

    def __str__(self):
        fmt = "<Procedure title=\"%s\" author=\"%s\" version=\"%s\">\n</Procedure>"
        return fmt % (self.title, self.author, self.version)

class Page(models.Model):
    page_order = models.IntegerField()
    procedure = models.ForeignKey(Procedure, related_name='pages')

    class Meta:
        unique_together = (
                ('page_order', 'procedure')
            )

class Element(models.Model):
    eid = models.CharField(max_length=255)
    concept = models.CharField(max_length=255)
    question = models.TextField()
    default_answer = models.TextField()
    element_order = models.IntegerField()
    page = models.ForeignKey(Page, related_name='elements')

    class Meta:
        unique_together = (
                ('element_order', 'page')
            )

class Choice(models.Model):
    value = models.CharField(max_length=255)

class ChoiceElement(Element):
    TYPES = (
            ('SELECT', 'SELECT'),
            ('MULTI_SELECT', 'MULTI_SELECT'),
            ('RADIO', 'RADIO')
        )
    element_type = models.CharField(max_length = 12, choices=TYPES)
    choices = models.ManyToManyField(Choice, related_name='element')

class SingleValueElement(Element):
    TYPES = (
            ('ENTRY', 'ENTRY'),
            ('GPS', 'GPS'),
            ('SOUND', 'SOUND'),
            ('PICTURE', 'PICTURE')
        )
    element_type = models.CharField(max_length = 12, choices=TYPES)
