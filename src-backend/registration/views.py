from django.http import JsonResponse
from django.contrib.auth.forms import AuthenticationForm
from django.views.decorators.http import require_http_methods
from django.views.decorators.csrf import csrf_exempt
from rest_framework.authtoken.models import Token

from forms import SignupForm

import logging
logger = logging.getLogger('auth')


def _flattenFormErrors(form):
    errors = form.errors.as_data()
    error_messages = ''
    for field in errors:
        error_messages += ' '
        error_messages += field
        fieldErrors = errors[field]
        for error in fieldErrors:
            error_messages += str(error)
    return error_messages.strip()


# While there is some risk is removing csrf protection from the signup form (http://stackoverflow.com/a/15604240),
# there really isn't any way to insert a csrf token to the user since Django never serves up any frontend html
@csrf_exempt
@require_http_methods(['POST'])
def signup(request):
    form = SignupForm(request.POST)
    valid_form = form.is_valid()
    token_key = None

    if valid_form:
        user = form.save()
        token_key = Token.objects.get(user=user).key
        logger.info("Signup Success: u:{0} e:{0}".format(user.username, user.email))
    else:
        logger.info("Signup Failed: {0}".format(_flattenFormErrors(form)))

    return JsonResponse({
        'success': valid_form,
        'errors': form.errors,
        'token': token_key,
    })


@csrf_exempt
@require_http_methods(['POST'])
def login(request):
    form = AuthenticationForm(data=request.POST)
    valid_form = form.is_valid()
    token_key = None

    if valid_form:
        form.clean()  # Calls authenticate(); will through ValidationException if form is invalid
        user = form.get_user()
        token_key = Token.objects.get(user=user).key
        logger.info("Login Success: u:{0} e:{0}".format(user.username, user.email))
    else:
        logger.info("Login Failed: {0}".format(_flattenFormErrors(form)))

    return JsonResponse({
        'success': valid_form,
        'errors': form.errors,
        'token': token_key,
    })
