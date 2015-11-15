from rest_framework.authtoken.models import Token


def add_token_to_header(self, user, token):
    key = Token.objects.get(user=user).key
    return "Token {0}".format(key)
