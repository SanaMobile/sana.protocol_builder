from django.conf import settings
from django.contrib.auth.models import User, Group, Permission
from django.contrib.contenttypes.models import ContentType
from models import Procedure, Page, Element, AbstractElement, Concept, ShowIf


def grant_permissions():
    # Grant model permissions to the appropriate user groups
    normal_users_group, created = Group.objects.get_or_create(name=settings.NORMAL_USER_GROUP)
    models = [Procedure, Page, Element, AbstractElement, Concept, ShowIf, User]

    for m in models:
        content_type = ContentType.objects.get_for_model(m)
        permissions = Permission.objects.filter(content_type=content_type)

        for p in permissions:
            normal_users_group.permissions.add(p)
