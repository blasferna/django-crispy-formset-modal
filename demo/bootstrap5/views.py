from django.shortcuts import render
from django.urls import reverse_lazy

from demo.bootstrap4.views import CreateInvoiceDemoView as B4CreateInvoiceDemoView
from demo.bootstrap5.forms import InvoiceForm


def index(request):
    views = [
        {
            "url_name": "demo:b5-invoice-and-items-management-example",
            "title": "Invoice and Items Management Example",
        }
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
