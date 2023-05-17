from django.urls import path

from demo.bootstrap5.views import CreateInvoiceDemoView, index

urlpatterns = [
    path("", index, name="b5-index"),
    path(
        "invoice-and-items-management-example/",
        CreateInvoiceDemoView.as_view(),
        name="b5-invoice-and-items-management-example",
    ),
]
