from extra_views import InlineFormSetFactory

from demo.forms import InvoiceItemForm
from demo.models import InvoiceItem


class InvoiceItemInline(InlineFormSetFactory):
    model = InvoiceItem
    form_class = InvoiceItemForm
    fields = ["description", "quantity", "unit_price"]
    factory_kwargs = {"extra": 0}
