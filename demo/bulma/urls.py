from django.urls import path

from demo.bulma.views import CreateInvoiceDemoView, index

urlpatterns = [
    path("", index, name="bulma-index"),
    path(
        "invoice-and-items-management-example/",
        CreateInvoiceDemoView.as_view(),
        name="bulma-invoice-and-items-management-example",
    ),
]
