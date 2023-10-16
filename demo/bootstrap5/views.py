from django.shortcuts import render
from django.urls import reverse_lazy

from demo.bootstrap4.views import CreateProjectDemoView as B4CreateProjectDemoView
from demo.bootstrap4.views import CreateInvoiceDemoView as B4CreateInvoiceDemoView
from demo.bootstrap4.views import (
    CreateInvoiceWithPaymentTermsDemoView as B4CreateInvoiceWithPaymentTermsDemoView,
)
from demo.bootstrap5.forms import InvoiceForm, InvoiceWithPaymentTermsForm, ProjectForm


def index(request):
    views = [
        {
            "url_name": "demo:b5-invoice-and-items-management-example",
            "title": "Invoice and Items Management Example",
        },
        {
            "url_name": "demo:b5-invoice-with-payment-terms-example",
            "title": "Invoice with Items and Payment Terms Example",
        },
        {
            "url_name": "demo:b5-project-management-example",
            "title": "Project management example",
        },
    ]
    return render(
        request,
        "demo_index.html",
        context={"views": views, "template_pack": "bootstrap5"},
    )


class CreateInvoiceDemoView(B4CreateInvoiceDemoView):
    form_class = InvoiceForm
    template_pack = "bootstrap5"
    index_url = reverse_lazy("demo:b5-index")
    success_url = reverse_lazy("demo:b5-invoice-and-items-management-example")


class CreateInvoiceWithPaymentTermsDemoView(B4CreateInvoiceWithPaymentTermsDemoView):
    form_class = InvoiceWithPaymentTermsForm
    template_pack = "bootstrap5"
    index_url = reverse_lazy("demo:b5-index")
    success_url = reverse_lazy("demo:b5-invoice-with-payment-terms-example")


class CreateProjectDemoView(B4CreateProjectDemoView):
    form_class = ProjectForm
    template_pack = "bootstrap5"
    index_url = reverse_lazy("demo:b5-index")
    success_url = reverse_lazy("demo:b5-project-management-example")
