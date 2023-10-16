from django.urls import path

from demo.bootstrap5.views import (
    CreateInvoiceDemoView,
    CreateInvoiceWithPaymentTermsDemoView,
    CreateProjectDemoView,
    index,
)

urlpatterns = [
    path("", index, name="b5-index"),
    path(
        "invoice-and-items-management-example/",
        CreateInvoiceDemoView.as_view(),
        name="b5-invoice-and-items-management-example",
    ),
    path(
        "invoice-with-payment-terms-example/",
        CreateInvoiceWithPaymentTermsDemoView.as_view(),
        name="b5-invoice-with-payment-terms-example",
    ),
    path(
        "project-management-example/",
        CreateProjectDemoView.as_view(),
        name="b5-project-management-example",
    ),
]
