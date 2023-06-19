from django.contrib import admin
from django.urls import include, path
from django.views.i18n import JavaScriptCatalog

from demo.autocomplete import UserAutocomplete
from demo.views import index

app_name = "demo"

test_patterns = (
    [
        path("", index, name="test-root"),
        path("bootstrap4/", include("demo.bootstrap4.urls")),
        path("bootstrap5/", include("demo.bootstrap5.urls")),
        path("tailwind/", include("demo.tailwind.urls")),
        path("bulma/", include("demo.bulma.urls")),
    ],
    app_name,
)


urlpatterns = [
    path("", include(test_patterns, namespace=app_name)),
    path("autocomplete/users/", UserAutocomplete.as_view(), name="user-autocomplete"),
    path("jsi18n", JavaScriptCatalog.as_view(), name="javascript-catalog"),
    path("admin/", admin.site.urls),
]
