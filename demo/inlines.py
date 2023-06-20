from extra_views import InlineFormSetFactory

from demo.forms import InvoiceItemForm, PaymentTermForm
from demo.models import InvoiceItem, PaymentTerm


class InvoiceItemInline(InlineFormSetFactory):
    model = InvoiceItem
    form_class = InvoiceItemForm
    fields = ["description", "quantity", "unit_price"]
    factory_kwargs = {"extra": 0}


class PaymentTermInline(InlineFormSetFactory):
    model = PaymentTerm
    form_class = PaymentTermForm
    fields = ["due_date", "amount"]
    factory_kwargs = {"extra": 0}
