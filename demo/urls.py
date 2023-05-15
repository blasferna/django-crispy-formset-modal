from django.conf import settings
from django.conf.urls.static import static
from django.contrib import admin
from django.urls import include, path

from demo.views import index

app_name = "demo"

test_patterns = (
    [
        path("", index, name="test-root"),
        path('bootstrap4/', include("demo.bootstrap4.urls")),
    ],
    app_name,
)

urlpatterns = [
    path("", include(test_patterns, namespace=app_name)),
    path("admin/", admin.site.urls),
]
urlpatterns += static(settings.STATIC_URL, document_root=settings.STATIC_ROOT)
