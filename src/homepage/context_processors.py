from django.contrib.sites.models import Site


def site(request):
    current_site = Site.objects.get_current()
    return {
        'SITE_DOMAIN': current_site.domain,
        'SITE_NAME': current_site.name
    }
