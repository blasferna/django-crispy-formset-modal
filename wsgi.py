import os

from django.core.wsgi import get_wsgi_application
from conftest import pytest_configure

pytest_configure(debug=False)
application = get_wsgi_application()
