from django.urls import path

from demo.bulma.views import (
    CreateInvoiceDemoView,
    CreateInvoiceWithPaymentTermsDemoView,
    index,
)

urlpatterns = [
    path("", index, name="bulma-index"),
    path(
        "invoice-and-items-management-example/",
        CreateInvoiceDemoView.as_view(),
        name="bulma-invoice-and-items-management-example",
    ),
    path(
        "invoice-with-payment-terms-example/",
        CreateInvoiceWithPaymentTermsDemoView.as_view(),
        name="bulma-invoice-with-payment-terms-example",
    ),
]
