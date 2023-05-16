import os
import sys

from django import setup
from django.conf import settings

BASE_DIR = os.path.dirname(os.path.abspath(__file__))
DEMO_DIR = os.path.join(BASE_DIR, "demo")
TEMPLATES_DIR = os.path.join(DEMO_DIR, "templates")


def pytest_configure(debug=False):
    base_settings = dict(
        SECRET_KEY="rprowrjp43u2904u290499;,*jk4l",
        DEBUG=debug,
        DATABASES={
            "default": {
                "ENGINE": "django.db.backends.sqlite3",
                "NAME": "test.db",
            }
        },
        INSTALLED_APPS=["django.contrib.staticfiles", "crispy_forms", "crispy_bootstrap4", "crispy_formset_modal", "demo"],
        ROOT_URLCONF="demo.urls",
        USE_I18N=True,
        USE_L10N=True,
        # Crispy Forms
        CRISPY_ALLOWED_TEMPLATE_PACKS = "bootstrap4",
        CRISPY_TEMPLATE_PACK = "bootstrap4",
        # Provide a lists of languages which your site supports.
        LANGUAGES=(
            ("en", "English"),
            ("es", "Spanish"),
        ),
        # Set the default language for your site.
        LANGUAGE_CODE="en",
        # Tell Django where the project's translation files should be.
        LOCALE_PATHS=(os.path.join(BASE_DIR, "crispy_formset_modal", "locale"),),
        TEMPLATES=[
            {
                "BACKEND": "django.template.backends.django.DjangoTemplates",
                "DIRS": [TEMPLATES_DIR],
                "APP_DIRS": True,
                "OPTIONS": {
                    "context_processors": [
                        "django.template.context_processors.debug",
                        "django.template.context_processors.request",
                        "django.contrib.auth.context_processors.auth",
                        "django.contrib.messages.context_processors.messages",
                    ],
                },
            },
        ],

        MIDDLEWARE = [
            'django.middleware.security.SecurityMiddleware',
            'django.contrib.sessions.middleware.SessionMiddleware',
            'django.middleware.common.CommonMiddleware',
            'django.middleware.csrf.CsrfViewMiddleware',
            'django.contrib.auth.middleware.AuthenticationMiddleware',
            'django.contrib.messages.middleware.MessageMiddleware',
            'django.middleware.clickjacking.XFrameOptionsMiddleware',
        ],
        STATIC_URL = '/static/',
        STATICFILES_DIRS = [
           os.path.join(BASE_DIR, "demo/static"),
           os.path.join(BASE_DIR, "crispy_formset_modal/static"),
        ],
        STATIC_ROOT = os.path.join(BASE_DIR, 'demo/staticfiles'),
    )

    if debug:
        base_settings.update(
            {
                "ALLOWED_HOSTS": ["*"],
                "INSTALLED_APPS": [
                    'django.contrib.admin',
                    "django.contrib.auth",
                    "django.contrib.contenttypes",
                    "django.contrib.sessions",
                    "django.contrib.messages",
                    "django.contrib.staticfiles",
                    'django.contrib.humanize',
                    "extra_views",
                    "crispy_forms",
                    "crispy_bootstrap4",
                    "crispy_formset_modal",
                    "demo",
                ],
            }
        )
    settings.configure(**base_settings)
    setup()
