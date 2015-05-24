"""
Django settings for sanaprotocolbuilder project.

For more information on this file, see
https://docs.djangoproject.com/en/1.6/topics/settings/

For the full list of settings and their values, see
https://docs.djangoproject.com/en/1.6/ref/settings/
"""

# Build paths inside the project like this: os.path.join(BASE_DIR, ...)
import os
BASE_DIR = os.path.dirname(os.path.dirname(__file__))

# ------------------------------------------------------------------------------
# Flags
# ------------------------------------------------------------------------------

# Quick-start development settings - unsuitable for production
# See https://docs.djangoproject.com/en/1.6/howto/deployment/checklist/

# SECURITY WARNING: keep the secret key used in production secret!
SECRET_KEY = os.environ['DJANGO_SECRET_KEY']

# SECURITY WARNING: don't run with debug turned on in production!
DEBUG = True

TEMPLATE_DEBUG = True

ALLOWED_HOSTS = []

INTERNAL_IPS = (
    '0.0.0.0',
    '127.0.0.1',
)

APPEND_SLASH = False

# ------------------------------------------------------------------------------
# Application definition
# ------------------------------------------------------------------------------

INSTALLED_APPS = (
    # Django apps
    'django.contrib.admin',         # Admin system
    'django.contrib.auth',          # User auth system
    'django.contrib.contenttypes',  # Track all of the models installed and provide high level interface

    # 3rd party apps
    'rest_framework',               # RESTful endpoint support
    'rest_framework.authtoken',     # Token based authentication
    'rest_framework_ember',         # Make django play nice with Ember
    'django_nose',                  # Better test framework/runner
    'corsheaders',                  # Cross-origin resource sharing

    # Our apps
    'api',
)

MIDDLEWARE_CLASSES = (
    'django.contrib.sessions.middleware.SessionMiddleware',
    'corsheaders.middleware.CorsMiddleware',
    'django.middleware.common.CommonMiddleware',
    'django.middleware.csrf.CsrfViewMiddleware',
    'django.contrib.auth.middleware.AuthenticationMiddleware',
    'django.contrib.messages.middleware.MessageMiddleware',
    'django.middleware.clickjacking.XFrameOptionsMiddleware',
)

ROOT_URLCONF = 'sanaprotocolbuilder.urls'

WSGI_APPLICATION = 'sanaprotocolbuilder.wsgi.application'

# ------------------------------------------------------------------------------
# Database
# https://docs.djangoproject.com/en/1.6/ref/settings/#databases
# ------------------------------------------------------------------------------

DATABASES = {
    'default': {
        'ENGINE':   'django.db.backends.postgresql_psycopg2',
        'NAME':     os.environ['DJANGO_DB_NAME'],
        'USER':     os.environ['DJANGO_DB_USER'],
        'PASSWORD': os.environ['DJANGO_DB_PASSWORD'],
        'HOST':     '127.0.0.1',
        'PORT':     '5432',
    }
}

# ------------------------------------------------------------------------------
# Password Hash
# https://docs.djangoproject.com/en/1.6/topics/auth/passwords/
# ------------------------------------------------------------------------------

PASSWORD_HASHERS = (
    'django.contrib.auth.hashers.BCryptSHA256PasswordHasher',
    'django.contrib.auth.hashers.BCryptPasswordHasher',
    'django.contrib.auth.hashers.PBKDF2PasswordHasher',
    'django.contrib.auth.hashers.PBKDF2SHA1PasswordHasher',
    'django.contrib.auth.hashers.SHA1PasswordHasher',
    'django.contrib.auth.hashers.MD5PasswordHasher',
    'django.contrib.auth.hashers.CryptPasswordHasher',
)

# ------------------------------------------------------------------------------
# Flatpages / Sites
# ------------------------------------------------------------------------------

TEMPLATE_CONTEXT_PROCESSORS = (
    # Django processors
    "django.contrib.auth.context_processors.auth",
    "django.template.context_processors.debug",
    "django.template.context_processors.i18n",
    "django.template.context_processors.media",
    "django.template.context_processors.static",
    "django.template.context_processors.tz",
    "django.contrib.messages.context_processors.messages"
)

# ------------------------------------------------------------------------------
# RESTful Endpoint
# https://github.com/lukaszb/django-guardian
# http://www.django-rest-framework.org/
# ------------------------------------------------------------------------------

AUTHENTICATION_BACKENDS = (
    'django.contrib.auth.backends.ModelBackend',  # default
)


REST_FRAMEWORK = {
    'DEFAULT_PARSER_CLASSES': (
        'rest_framework_ember.parsers.JSONParser',
        'rest_framework.parsers.FormParser',
        'rest_framework.parsers.MultiPartParser'
    ),
    'DEFAULT_RENDERER_CLASSES': (
        'rest_framework_ember.renderers.JSONRenderer',
        'rest_framework.renderers.BrowsableAPIRenderer',
    ),

    'DEFAULT_PERMISSION_CLASSES': [
        'rest_framework.permissions.DjangoModelPermissions',
    ],

    # Set token authentication as global authentication method (can be overwritten per view)
    # http://www.django-rest-framework.org/api-guide/authentication#setting-the-authentication-scheme
    'DEFAULT_AUTHENTICATION_CLASSES': (
        'rest_framework.authentication.TokenAuthentication',
    )
}

REST_EMBER_FORMAT_KEYS = True
REST_EMBER_PLURALIZE_KEYS = True

# ------------------------------------------------------------------------------
# Internationalization
# https://docs.djangoproject.com/en/1.6/topics/i18n/
# ------------------------------------------------------------------------------

LANGUAGE_CODE = 'en-us'

TIME_ZONE = 'UTC'

USE_I18N = True

USE_L10N = True

USE_TZ = True

# ------------------------------------------------------------------------------
# Test Configuration
# ------------------------------------------------------------------------------

TEST_RUNNER = 'django_nose.NoseTestSuiteRunner'

# ------------------------------------------------------------------------------
# Cross-origin request handling
# ------------------------------------------------------------------------------

CORS_ORIGIN_ALLOW_ALL = True  # Temporary
