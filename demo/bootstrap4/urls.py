from django.urls import path

from demo.bootstrap4.views import (
    CreateInvoiceDemoView,
    CreateInvoiceWithPaymentTermsDemoView,
    index,
)

urlpatterns = [
    path("", index, name="b4-index"),
    path(
        "invoice-and-items-management-example/",
        CreateInvoiceDemoView.as_view(),
        name="b4-invoice-and-items-management-example",
    ),
    path(
        "invoice-with-payment-terms-example/",
        CreateInvoiceWithPaymentTermsDemoView.as_view(),
        name="b4-invoice-with-payment-terms-example",
    ),
]
