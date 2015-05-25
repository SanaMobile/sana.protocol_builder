from django.contrib.auth.models import User
from django.dispatch import receiver
from django.db.models.signals import post_save
from rest_framework.authtoken.models import Token


@receiver(post_save, sender=User)
def on_user_post_save(sender, instance=None, created=False, **kwargs):
    # Normally, users automatically get a Token created for them (if they do not already have one) when they hit
    # rest_framework.authtoken.views.obtain_auth_token view
    #
    # This will create an authentication token for newly created users too so the user registration endpoint can return
    # a token back to Ember (thus avoiding the need to hit login endpoint)
    if created:
        Token.objects.create(user=instance)
