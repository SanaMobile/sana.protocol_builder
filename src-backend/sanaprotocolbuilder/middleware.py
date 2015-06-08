import traceback
from django.conf import settings


class ExceptionLoggingMiddleware(object):
    def process_exception(self, request, exception):
        if settings.DEBUG:
            print traceback.format_exc()
