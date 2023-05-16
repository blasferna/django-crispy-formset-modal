from django.urls import path

from demo.bootstrap4.views import CreateInvoiceDemoView, index

urlpatterns = [
    path("", index, name="b4-index"),
    path(
        "invoice-and-items-management-example/",
        CreateInvoiceDemoView.as_view(),
        name="b4-invoice-and-items-management-example",
    ),
]
