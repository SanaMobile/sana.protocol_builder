from django.contrib.auth.models import User
from django.dispatch import receiver
from django.db.models.signals import post_save
from rest_framework.authtoken.models import Token

@receiver(post_save, sender=User)
def on_user_post_save(sender, instance=None, created=False, **kwargs):
    # Create an authentication token for newly created users.
    if created:
        Token.objects.create(user=instance)
