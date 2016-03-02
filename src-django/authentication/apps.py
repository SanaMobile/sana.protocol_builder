from django.apps import AppConfig


class AuthenticationConfig(AppConfig):
    name = 'authentication'
    verbose_name = 'Sana Protocol Builder - Authentication Module'

    def ready(self):
        # Register signals
        from signals import user_post_save  # noqa
