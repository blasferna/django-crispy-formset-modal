from django.urls import path

from demo.tailwind.views import (
    CreateInvoiceDemoView,
    CreateInvoiceWithPaymentTermsDemoView,
    index,
)

urlpatterns = [
    path("", index, name="tailwind-index"),
    path(
        "invoice-and-items-management-example/",
        CreateInvoiceDemoView.as_view(),
        name="tailwind-invoice-and-items-management-example",
    ),
    path(
        "invoice-with-payment-terms-example/",
        CreateInvoiceWithPaymentTermsDemoView.as_view(),
        name="tailwind-invoice-with-payment-terms-example",
    ),
]
