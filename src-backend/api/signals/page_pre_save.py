from django.dispatch import receiver
from django.db.models.signals import pre_save
from django.db.models import F
from api.models import Page
import logging

logger = logging.getLogger('debugger')


@receiver(pre_save, sender=Page)
def on_page_pre_save(sender, instance=None, raw=False, **kwargs):
    # Update index of all objects with display index >= object we are saving
    if instance.display_index is not None:
        logger.info("Updating display indices >= {0}".format(instance.display_index))
        Page.objects.filter(display_index__gte=instance.display_index)\
                    .update(display_index=(F('display_index') + 1))
