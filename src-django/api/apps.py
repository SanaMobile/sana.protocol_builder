from django.apps import AppConfig
from django.db.models.signals import post_migrate


def on_post_migrate(sender, **kwargs):
    import startup
    startup.grant_permissions()


class ApiConfig(AppConfig):
    name = 'api'
    verbose_name = 'Sana Protocol Builder - RESTful API Module'

    def ready(self):
        post_migrate.connect(on_post_migrate, sender=self)
