"""
Django settings for sana_builder project.

For more information on this file, see
https://docs.djangoproject.com/en/1.6/topics/settings/

For the full list of settings and their values, see
https://docs.djangoproject.com/en/1.6/ref/settings/
"""

# Build paths inside the project like this: os.path.join(BASE_DIR, ...)
import os
BASE_DIR = os.path.dirname(os.path.dirname(__file__))

#------------------------------------------------------------------------------
# Flags
#------------------------------------------------------------------------------

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

#------------------------------------------------------------------------------
# Application definition
#------------------------------------------------------------------------------

INSTALLED_APPS = (
    # Django apps
    'django.contrib.admin',
    'django.contrib.auth',
    'django.contrib.contenttypes',
    'django.contrib.flatpages',
    'django.contrib.messages',
    'django.contrib.sessions',
    'django.contrib.sites',
    'django.contrib.staticfiles',

    # 3rd party apps
    'compressor',                   # Compressing static files
    'guardian',                     # Object-level permissions
    'rest_framework',               # RESTful endpoint support
    'rest_framework.authtoken',     # Token based authentication
    'django_nose',                  # Better test framework/runner

    # Our apps
    'webapp'
)

MIDDLEWARE_CLASSES = (
    'django.contrib.sessions.middleware.SessionMiddleware',
    'django.middleware.common.CommonMiddleware',
    'django.middleware.csrf.CsrfViewMiddleware',
    'django.contrib.auth.middleware.AuthenticationMiddleware',
    'django.contrib.messages.middleware.MessageMiddleware',
    'django.middleware.clickjacking.XFrameOptionsMiddleware',
)

ROOT_URLCONF = 'sana_builder.urls'

WSGI_APPLICATION = 'sana_builder.wsgi.application'

#------------------------------------------------------------------------------
# Database
# https://docs.djangoproject.com/en/1.6/ref/settings/#databases
#------------------------------------------------------------------------------

DATABASES = {
    'default': {
        'ENGINE'    : 'django.db.backends.postgresql_psycopg2',
        'NAME'      : os.environ['DJANGO_DB_NAME'],
        'USER'      : os.environ['DJANGO_DB_USER'],
        'PASSWORD'  : os.environ['DJANGO_DB_PASSWORD'],
        'HOST'      : '127.0.0.1',
        'PORT'      : '5432',
    }
}

#------------------------------------------------------------------------------
# Password Hash
# https://docs.djangoproject.com/en/1.6/topics/auth/passwords/
#------------------------------------------------------------------------------

PASSWORD_HASHERS = (
    'django.contrib.auth.hashers.BCryptSHA256PasswordHasher',
    'django.contrib.auth.hashers.BCryptPasswordHasher',
    'django.contrib.auth.hashers.PBKDF2PasswordHasher',
    'django.contrib.auth.hashers.PBKDF2SHA1PasswordHasher',
    'django.contrib.auth.hashers.SHA1PasswordHasher',
    'django.contrib.auth.hashers.MD5PasswordHasher',
    'django.contrib.auth.hashers.CryptPasswordHasher',
)

#------------------------------------------------------------------------------
# Flatpages / Sites
#------------------------------------------------------------------------------

# Tells django_site (flatpage management) which website's database to use
# (in case our database hosts multiple sites)
SITE_ID = 1

TEMPLATE_CONTEXT_PROCESSORS = (
    # Django apps
    "django.contrib.auth.context_processors.auth",
    "django.core.context_processors.debug",
    "django.core.context_processors.i18n",
    "django.core.context_processors.media",
    "django.core.context_processors.static",
    "django.core.context_processors.tz",

    # Our apps
    'webapp.context_processors.site',
)

#------------------------------------------------------------------------------
# RESTful Endpoint
# https://github.com/lukaszb/django-guardian
# http://www.django-rest-framework.org/
#------------------------------------------------------------------------------

ANONYMOUS_USER_ID = -1 # For Django guardian
AUTHENTICATION_BACKENDS = (
    'django.contrib.auth.backends.ModelBackend', # default
    'guardian.backends.ObjectPermissionBackend',
)

REST_FRAMEWORK = {
    # Use Django's standard `django.contrib.auth` permissions,
    # or allow read-only access for unauthenticated users.
    'DEFAULT_PERMISSION_CLASSES': [
        'rest_framework.permissions.DjangoModelPermissions',
    ],

    # Set token authentication as global authentication method (can be overwritten per view)
    # http://www.django-rest-framework.org/api-guide/authentication#setting-the-authentication-scheme
    'DEFAULT_AUTHENTICATION_CLASSES': (
        'rest_framework.authentication.TokenAuthentication',
    )
}

#------------------------------------------------------------------------------
# Internationalization
# https://docs.djangoproject.com/en/1.6/topics/i18n/
#------------------------------------------------------------------------------

LANGUAGE_CODE = 'en-us'

TIME_ZONE = 'UTC'

USE_I18N = True

USE_L10N = True

USE_TZ = True

#------------------------------------------------------------------------------
# Static files (CSS, JavaScript, Images)
# https://docs.djangoproject.com/en/1.6/howto/static-files/
#------------------------------------------------------------------------------

STATIC_URL  = '/static/'
STATIC_ROOT = os.path.join(BASE_DIR, 'static')

# Compile less
COMPRESS_PRECOMPILERS = (
    ('text/less', 'lessc -x {infile} {outfile}'),
)
# Use 'compressor' as a static file finder
STATICFILES_FINDERS = (
    'compressor.finders.CompressorFinder',
)

#------------------------------------------------------------------------------
# Test Configuration
#------------------------------------------------------------------------------

TEST_RUNNER = 'django_nose.NoseTestSuiteRunner'
