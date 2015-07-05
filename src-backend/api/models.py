from django.db import models
from django.contrib.auth.models import User


class Procedure(models.Model):
    title = models.CharField(max_length=255)
    author = models.CharField(max_length=255)
    version = models.CharField(max_length=255, null=True)
    uuid = models.CharField(max_length=36, null=True)
    owner = models.ForeignKey(User)
    last_modified = models.DateField(auto_now=True)
    created = models.DateField(auto_now_add=True)

    class Meta():
        app_label = 'api'


class Page(models.Model):
    display_index = models.PositiveIntegerField()
    procedure = models.ForeignKey(Procedure, related_name='pages')
    last_modified = models.DateField(auto_now=True)
    created = models.DateField(auto_now_add=True)

    class Meta:
        app_label = 'api'
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
    eid = models.CharField(max_length=255, null=True, blank=True)
    element_type = models.CharField(max_length=12, choices=TYPES, null=True, blank=True)
    choices = models.TextField(null=True, blank=True)
    numeric = models.CharField(max_length=255, null=True, blank=True)
    concept = models.TextField(null=True, blank=True)
    question = models.TextField(null=True, blank=True)
    answer = models.TextField(null=True, blank=True)
    page = models.ForeignKey(Page, related_name='elements')
    last_modified = models.DateField(auto_now=True)
    created = models.DateField(auto_now_add=True)

    class Meta:
        app_label = 'api'
        ordering = ['page', 'display_index']
