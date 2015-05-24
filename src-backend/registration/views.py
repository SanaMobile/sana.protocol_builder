from django.http import JsonResponse
from django.views.decorators.http import require_http_methods
from django.views.decorators.csrf import csrf_exempt
from rest_framework.authtoken.models import Token

from forms import SignupForm


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
        token = Token.objects.get(user=user)
        token_key = token.key

    return JsonResponse({
        'success': valid_form,
        'errors': form.errors,
        'token': token_key,
    })
