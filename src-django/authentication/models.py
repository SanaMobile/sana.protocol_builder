from django.db import models
from django.contrib.auth.models import User


class UserProfile(models.Model):
    user = models.OneToOneField(User, related_name="profile", on_delete=models.CASCADE)
    is_email_confirmed = models.BooleanField(default=False)

    class Meta:
        app_label = 'authentication'


class MDSLink(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    mds_link = models.URLField()
