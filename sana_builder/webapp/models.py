from django.db import models
from django.contrib.auth.models import User

class Procedure(models.Model):
    title = models.CharField(max_length=50)
    author = models.CharField(max_length=50)
    uuid = models.IntegerField(null=True)
    version = models.CharField(max_length=50, null=True)
    owner = models.ForeignKey(User, unique=True)

class Page(models.Model):
    procedure = models.ForeignKey(Procedure)
