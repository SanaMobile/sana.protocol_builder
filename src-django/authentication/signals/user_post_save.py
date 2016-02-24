from authentication.models import UserProfile
from django.contrib.auth.models import User, Group
from django.dispatch import receiver
from django.db.models.signals import post_save
from django.conf import settings
from rest_framework.authtoken.models import Token


@receiver(post_save, sender=User)
def on_user_post_save(sender, instance=None, created=False, **kwargs):
    # Normally, users automatically get a Token created for them (if they do not
    # already have one) when they hit
    #
    #   rest_framework.authtoken.views.obtain_auth_token view
    #
    # This will create an authentication token for newly created users so the
    # user registration endpoint can return a token back to Ember
    # (thus avoiding the need to hit login endpoint)
    if created:
        user_profile = UserProfile.objects.create(user=instance, is_email_confirmed=False)
        user_profile.save()

        Token.objects.create(user=instance)

    # Add new user to the proper user group
    normal_users_group, created = Group.objects.get_or_create(name=settings.NORMAL_USER_GROUP)
    instance.groups.add(normal_users_group)
