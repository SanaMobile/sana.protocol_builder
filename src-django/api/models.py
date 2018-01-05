from django.db import models
from django.contrib.auth.models import User
from django.db import IntegrityError
import uuid


class Procedure(models.Model):
    title = models.CharField(max_length=255, blank=True)
    author = models.CharField(max_length=255, blank=True)
    uuid = models.UUIDField(default=uuid.uuid4, editable=False)
    owner = models.ForeignKey(User, on_delete=models.CASCADE)
    last_modified = models.DateTimeField(auto_now=True)
    created = models.DateTimeField(auto_now_add=True)

    class Meta():
        app_label = 'api'


class Page(models.Model):
    display_index = models.PositiveIntegerField()
    procedure = models.ForeignKey(Procedure, related_name='pages', on_delete=models.CASCADE)
    last_modified = models.DateTimeField(auto_now=True)
    created = models.DateTimeField(auto_now_add=True)

    def save(self, **kwargs):
        super(Page, self).save()

        self.procedure.last_modified = self.last_modified
        self.procedure.save()

    class Meta:
        app_label = 'api'
        ordering = ['procedure', 'display_index']


class Concept(models.Model):
    TYPES = (
        ('string', 'string'),
        ('boolean', 'boolean'),
        ('number', 'number'),
        ('complex', 'complex')
    )

    uuid = models.UUIDField(default=uuid.uuid4, null=False, blank=False, editable=False)
    created = models.DateTimeField(auto_now_add=True)
    last_modified = models.DateTimeField(auto_now=True)
    name = models.CharField(max_length=255, null=False, blank=False, unique=True)
    display_name = models.CharField(max_length=255, null=False, blank=False)
    description = models.TextField(null=True, blank=True)
    data_type = models.CharField(max_length=16, choices=TYPES, null=True, blank=True)
    mime_type = models.CharField(max_length=128, null=True, blank=True)
    constraint = models.TextField(null=True, blank=True)

    def save(self, **kwargs):
        if self.data_type and (self.data_type, self.data_type) not in self.TYPES:
            raise IntegrityError('Invalid data type')

        super(Concept, self).save()

    class Meta:
        app_label = 'api'


class Element(models.Model):
    TYPES = (
        ('DATE', 'DATE'),
        ('ENTRY', 'ENTRY'),
        ('SELECT', 'SELECT'),
        ('MULTI_SELECT', 'MULTI_SELECT'),
        ('RADIO', 'RADIO'),
        ('PICTURE', 'PICTURE'),
        ('PLUGIN', 'PLUGIN'),
        ('ENTRY_PLUGIN', 'ENTRY_PLUGIN')
    )

    CHOICE_TYPES = (
        'SELECT',
        'MULTI_SELECT',
        'RADIO'
    )

    PLUGIN_TYPES = (
        'PLUGIN',
        'ENTRY_PLUGIN'
    )

    display_index = models.PositiveIntegerField()
    element_type = models.CharField(max_length=12, choices=TYPES)
    choices = models.TextField(null=True, blank=True)
    concept = models.ForeignKey(Concept, null=True, related_name='elements')
    question = models.TextField(null=True, blank=True)
    answer = models.TextField(null=True, blank=True)

    required = models.BooleanField(default=False)
    image = models.TextField(null=True, blank=True)
    audio = models.TextField(null=True, blank=True)
    action = models.TextField(null=True, blank=True)
    mime_type = models.CharField(max_length=128, null=True, blank=True)

    page = models.ForeignKey(Page, related_name='elements', on_delete=models.CASCADE)
    last_modified = models.DateTimeField(auto_now=True)
    created = models.DateTimeField(auto_now_add=True)

    def save(self, **kwargs):
        if self.element_type:
            if (self.element_type, self.element_type) not in self.TYPES:
                raise IntegrityError('Invalid element type')

        super(Element, self).save()

        self.page.last_modified = self.last_modified
        self.page.save()

    class Meta:
        app_label = 'api'
        ordering = ['page', 'display_index']


class ShowIf(models.Model):
    LOGICAL_TYPES = (
        'AND',
        'OR',
        'NOT'
    )

    CRITERIA_TYPES = (
        'EQUALS',
        'GREATER',
        'LESS'
    )

    page = models.ForeignKey(Page, related_name='show_if', on_delete=models.CASCADE)
    last_modified = models.DateTimeField(auto_now=True)
    created = models.DateTimeField(auto_now_add=True)
    conditions = models.TextField()

    def save(self, **kwargs):
        super(ShowIf, self).save()

        self.page.last_modified = self.last_modified
        self.page.save()

    class Meta:
        app_label = 'api'
