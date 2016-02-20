from api.tests.utils import factories
from authentication.models import EMAIL_CONFIRMATION_KEY_TTL_DAYS, UserProfile, EmailConfirmationKey
import datetime
import factory


class UserProfileFactory(factory.django.DjangoModelFactory):
    class Meta:
        model = UserProfile
        django_get_or_create = ('user',)

    user = factory.SubFactory(factories.UserFactory)
    is_email_confirmed = False


class EmailConfirmationKeyFactory(factory.django.DjangoModelFactory):
    class Meta:
        model = EmailConfirmationKey
        django_get_or_create = ('user',)

    user = factory.SubFactory(factories.UserFactory)
    key = '84bff1c64351a616828596f01b4e0d3155190eb5'
    expiration = datetime.datetime.today() + datetime.timedelta(EMAIL_CONFIRMATION_KEY_TTL_DAYS)
