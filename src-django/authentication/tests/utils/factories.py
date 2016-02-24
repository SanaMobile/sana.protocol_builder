from api.tests.utils import factories
from authentication.models import UserProfile
import factory


class UserProfileFactory(factory.django.DjangoModelFactory):
    class Meta:
        model = UserProfile
        django_get_or_create = ('user',)

    user = factory.SubFactory(factories.UserFactory)
    is_email_confirmed = False
