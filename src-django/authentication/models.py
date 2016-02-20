from django.db import models
from django.contrib.auth.models import User
import datetime
import hashlib
import random

EMAIL_CONFIRMATION_KEY_TTL_DAYS = 2


class UserProfile(models.Model):
    user = models.OneToOneField(User, related_name="profile", on_delete=models.CASCADE)
    is_email_confirmed = models.BooleanField(default=False)

    class Meta:
        app_label = 'authentication'


class EmailConfirmationKey(models.Model):
    user = models.OneToOneField(User)
    key = models.CharField(max_length=40, null=False, blank=False)
    expiration = models.DateTimeField()

    @classmethod
    def create_from_user(cls, user):
        salt = hashlib.sha1(str(random.random())).hexdigest()[:5]
        key = hashlib.sha1(salt + user.email).hexdigest()
        expiration = datetime.datetime.today() + datetime.timedelta(EMAIL_CONFIRMATION_KEY_TTL_DAYS)

        return cls(user=user, key=key, expiration=expiration)

    class Meta:
        app_label = 'authentication'
