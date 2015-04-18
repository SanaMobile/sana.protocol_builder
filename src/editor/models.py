from django.db import models
from django.contrib.auth.models import User
from signals import user_post_save  # noqa

class Procedure(models.Model):
    title = models.CharField(max_length=255)
    author = models.CharField(max_length=255)
    version = models.CharField(max_length=255)
    owner = models.ForeignKey(User, unique=True)

    def __str__(self):
        fmt = """<Procedure title=\"%s\" author=\"%s\" version=\"%s\">
</Procedure>"""
        return fmt % (self.title, self.author, self.version)


class Page(models.Model):
    procedure = models.ForeignKey(Procedure)
