from django.db import models
from django.contrib.auth.models import User


class Procedure(models.Model):
    title = models.CharField(max_length=255)
    author = models.CharField(max_length=255)
    version = models.CharField(max_length=255, null=True)
    uuid = models.CharField(max_length=40, null=True)
    owner = models.ForeignKey(User)


class Page(models.Model):
    display_index = models.PositiveIntegerField()
    procedure = models.ForeignKey(Procedure, related_name='pages')

    class Meta:
        ordering = ['procedure', 'display_index']


class Element(models.Model):
    TYPES = (
        ('SELECT', 'SELECT'),
        ('MULTI_SELECT', 'MULTI_SELECT'),
        ('RADIO', 'RADIO'),
        ('GPS', 'GPS'),
        ('SOUND', 'SOUND'),
        ('PICTURE', 'PICTURE'),
        ('ENTRY', 'ENTRY')
    )

    display_index = models.PositiveIntegerField()
    eid = models.CharField(max_length=255)
    element_type = models.CharField(max_length=12, choices=TYPES)
    choices = models.TextField(null=True)
    numeric = models.CharField(max_length=255, null=True)
    concept = models.TextField()
    question = models.TextField()
    answer = models.TextField(blank=True)
    page = models.ForeignKey(Page, related_name='elements')

    class Meta:
        ordering = ['page', 'display_index']
