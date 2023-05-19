from django.shortcuts import render
from django.urls import reverse_lazy

from demo.bootstrap4.views import CreateInvoiceDemoView as B4CreateInvoiceDemoView
from demo.bootstrap4.views import (
    CreateInvoiceWithPaymentTermsDemoView as B4CreateInvoiceWithPaymentTermsDemoView,
)
from demo.bulma.forms import InvoiceForm, InvoiceWithPaymentTermsForm


def index(request):
    views = [
        {
            "url_name": "demo:bulma-invoice-and-items-management-example",
            "title": "Invoice and Items Management Example",
        },
        {
            "url_name": "demo:bulma-invoice-with-payment-terms-example",
            "title": "Invoice with Items and Payment Terms Example",
        },
    ]
    return render(
        request,
        "demo_index.html",
        context={"views": views, "template_pack": "bulma"},
    )


class CreateInvoiceDemoView(B4CreateInvoiceDemoView):
    form_class = InvoiceForm
    template_pack = "bulma"
    index_url = reverse_lazy("demo:bulma-index")
    success_url = reverse_lazy("demo:bulma-invoice-and-items-management-example")


class CreateInvoiceWithPaymentTermsDemoView(B4CreateInvoiceWithPaymentTermsDemoView):
    form_class = InvoiceWithPaymentTermsForm
    template_pack = "bulma"
    index_url = reverse_lazy("demo:bulma-index")
    success_url = reverse_lazy("demo:bulma-invoice-with-payment-terms-example")
