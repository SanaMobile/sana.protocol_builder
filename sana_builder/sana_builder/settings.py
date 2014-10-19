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
SECRET_KEY = 'cl=(qt*#rkhilys5cjtaldhxtfcj^kqt+sdi9j(!j+86$il2y@'

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
    'django.contrib.sessions',
    'django.contrib.messages',
    'django.contrib.staticfiles',

    # Dependencies
    'compressor',

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
        'NAME'      : 'sana_builder',
        'USER'      : 'sana_builder',
        'PASSWORD'  : 'sana_builder',
        'HOST'      : 'localhost',
        'PORT'      : '',
    }
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
    ('text/less', 'lessc {infile} {outfile}'),
)
# Use 'compressor' as a static file finder
STATICFILES_FINDERS = (
    'compressor.finders.CompressorFinder',
)
