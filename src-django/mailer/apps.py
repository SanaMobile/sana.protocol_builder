from django.apps import AppConfig


class MailerConfig(AppConfig):
    name = 'mailer'
    verbose_name = 'Sana Protocol Builder - Email Module'

    def ready(self):
        pass
