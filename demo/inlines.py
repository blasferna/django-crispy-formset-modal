from extra_views import InlineFormSetFactory

from demo.forms import InvoiceItemForm, PaymentTermForm, TaskForm
from demo.models import InvoiceItem, PaymentTerm, Task


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


class TaskInline(InlineFormSetFactory):
    model = Task
    form_class = TaskForm
    fields = ["title", "assigned_to"]
    factory_kwargs = {"extra": 0}
