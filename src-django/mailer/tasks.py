from __future__ import absolute_import

from django.core.mail import send_mail
from celery import shared_task


@shared_task
def send_email(recipient, subject, body):
    send_mail(subject, body, None, [recipient], fail_silently=False)
