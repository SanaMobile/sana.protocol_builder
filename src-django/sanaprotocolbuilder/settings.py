"""
Django settings for sanaprotocolbuilder project.

For more information on this file, see
https://docs.djangoproject.com/en/1.6/topics/settings/

For the full list of settings and their values, see
https://docs.djangoproject.com/en/1.6/ref/settings/
"""

# Build paths inside the project like this: os.path.join(BASE_DIR, ...)
import os
BASE_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))

# ------------------------------------------------------------------------------
# Flags
# ------------------------------------------------------------------------------

# Quick-start development settings - unsuitable for production
# See https://docs.djangoproject.com/en/1.8/howto/deployment/checklist/

# SECURITY WARNING: keep the secret key used in production secret!
SECRET_KEY = os.environ['DJANGO_SECRET_KEY']

# SECURITY WARNING: don't run with debug turned on in production!
DEBUG = True

ALLOWED_HOSTS = []

INTERNAL_IPS = (
    '0.0.0.0',
    '127.0.0.1',
)

APPEND_SLASH = False

# ------------------------------------------------------------------------------
# Application definition
# ------------------------------------------------------------------------------

INSTALLED_APPS = [
    # Django apps
    'django.contrib.admin',         # Admin system
    'django.contrib.sessions',      # Dependency of django.contrib.auth
    'django.contrib.contenttypes',  # Track all of the models installed and provide object level permissions
    'django.contrib.auth',          # User auth system
    'django.contrib.staticfiles',   # Serving static files on Django error pages

    # 3rd party apps
    'rest_framework',               # RESTful endpoint support
    'rest_framework.authtoken',     # Token based authentication
    'django_nose',                  # Better test framework/runner
    'corsheaders',                  # Cross-origin resource sharing
    'django_extensions',            # Adds some useful dev commands for convenience
    'rest_hooks',                   # Adds web hooks

    # Our apps
    'authentication.apps.AuthenticationConfig',
    'api.apps.ApiConfig',
    'mailer.apps.MailerConfig',
]

MIDDLEWARE_CLASSES = [
    'django.contrib.sessions.middleware.SessionMiddleware',
    'corsheaders.middleware.CorsMiddleware',
    'django.middleware.common.CommonMiddleware',
    'django.middleware.csrf.CsrfViewMiddleware',
    'django.contrib.auth.middleware.AuthenticationMiddleware',
    'django.contrib.messages.middleware.MessageMiddleware',
    'django.middleware.clickjacking.XFrameOptionsMiddleware',

    'sanaprotocolbuilder.middleware.ExceptionLoggingMiddleware',
]

ROOT_URLCONF = 'sanaprotocolbuilder.urls'

WSGI_APPLICATION = 'sanaprotocolbuilder.wsgi.application'

CACHES = {
    'default': {
        'BACKEND': 'redis_cache.RedisCache',
        'LOCATION': 'localhost:6379',
    },
}

# ------------------------------------------------------------------------------
# Database
# https://docs.djangoproject.com/en/1.8/ref/settings/#databases
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
# https://docs.djangoproject.com/en/1.8/topics/auth/passwords/
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
# RESTful Endpoint
# https://github.com/lukaszb/django-guardian
# http://www.django-rest-framework.org/
# ------------------------------------------------------------------------------

AUTHENTICATION_BACKENDS = (
    'django.contrib.auth.backends.ModelBackend',  # default
)


REST_FRAMEWORK = {
    'DEFAULT_PERMISSION_CLASSES': [
        'rest_framework.permissions.DjangoModelPermissions',
    ],

    # Set token authentication as global authentication method (can be overwritten per view)
    # http://www.django-rest-framework.org/api-guide/authentication#setting-the-authentication-scheme
    'DEFAULT_AUTHENTICATION_CLASSES': (
        'rest_framework.authentication.TokenAuthentication',
    )
}

# ------------------------------------------------------------------------------
# Email Configuration
# https://docs.djangoproject.com/en/1.9/topics/email/
# ------------------------------------------------------------------------------

DEFAULT_FROM_EMAIL = os.environ['EMAIL_FROM']
EMAIL_HOST = os.environ['EMAIL_HOST']
EMAIL_HOST_USER = os.environ['EMAIL_HOST_USER']
EMAIL_HOST_PASSWORD = os.environ['EMAIL_HOST_PASSWORD']
EMAIL_PORT = 587
EMAIL_USE_TLS = True

# ------------------------------------------------------------------------------
# Celery Configuration
# http://docs.celeryproject.org/en/latest/configuration.html
# ------------------------------------------------------------------------------

BROKER_URL = 'redis://localhost:6379'
CELERY_ACCEPT_CONTENT = ['application/json']
CELERY_TASK_SERIALIZER = 'json'
CELERY_RESULT_SERIALIZER = 'json'

# ------------------------------------------------------------------------------
# Logging
# https://docs.djangoproject.com/en/1.8/topics/logging/
# ------------------------------------------------------------------------------

LOGGING = {
    'version': 1,
    'disable_existing_loggers': False,
    'formatters': {
        'simple': {
            'format': '[%(levelname)s] [%(asctime)s] [%(module)s] %(message)s'
        },
        'box': {
            'format': '[%(levelname)s]\n' + ('-' * 80) + '\n%(message)s\n' + ('-' * 80) + '\n'
        },
    },
    'handlers': {
        'console': {
            'class': 'logging.StreamHandler',
            'formatter': 'simple',
        },
        'console-debug': {
            'class': 'logging.StreamHandler',
            'formatter': 'box',
        },
    },
    'loggers': {
        'debugger': {
            'handlers': ['console-debug'],
            'level': 'DEBUG',
            'propagate': True,
        },
        'auth': {
            'handlers': ['console'],
            'level': 'INFO',
            'propagate': True,
        }
    },
}

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

# ------------------------------------------------------------------------------
# Static path
# Since Django Rest Framework's error pages have the {% load staticfiles %} tag,
# we need to include the staticfiles module and its configuration even if we
# do not need static files
# ------------------------------------------------------------------------------

STATIC_URL = '/static/'
STATIC_ROOT = os.path.join(BASE_DIR, 'static')

# ------------------------------------------------------------------------------
# Global Constants
# ------------------------------------------------------------------------------

NORMAL_USER_GROUP = 'normal_users'

# ------------------------------------------------------------------------------
# Templates
# ------------------------------------------------------------------------------

TEMPLATES = [
    {
        'BACKEND': 'django.template.backends.django.DjangoTemplates',
        'DIRS': [],
        'APP_DIRS': True,
        'OPTIONS': {
            'context_processors': [
                'django.contrib.auth.context_processors.auth',
                'django.template.context_processors.debug',
                'django.template.context_processors.i18n',
                'django.template.context_processors.media',
                'django.template.context_processors.static',
                'django.template.context_processors.tz',
                'django.contrib.messages.context_processors.messages',
            ],
            'debug': DEBUG
        },
    },
]

# ------------------------------------------------------------------------------
# Web Hooks
# ------------------------------------------------------------------------------

HOOK_EVENTS = {
    'procedure.added': 'api.Procedure.created', # Web hook on Procedure Object? if we find it
    'procedure.changed': 'api.Procedure.updated+',
    'procedure.removed': 'api.Procedure.deleted',
}
