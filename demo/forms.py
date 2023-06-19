from dal import autocomplete
from django import forms

from crispy_formset_modal.helper import ModalEditFormHelper
from crispy_formset_modal.layout import ModalEditLayout
from demo.models import InvoiceItem, PaymentTerm, Project, Task
from demo.widgets import DateInput


class InvoiceItemForm(forms.ModelForm):
    def __init__(self, *args, **kwargs):
        super().__init__(*args, **kwargs)
        self.helper = ModalEditFormHelper()
        self.helper.layout = ModalEditLayout(
            "description",
            "quantity",
            "unit_price",
        )

    class Meta:
        model = InvoiceItem
        fields = "__all__"


class PaymentTermForm(forms.ModelForm):
    def __init__(self, *args, **kwargs):
        super().__init__(*args, **kwargs)
        self.helper = ModalEditFormHelper()
        self.helper.layout = ModalEditLayout(
            "due_date",
            "amount",
        )

    class Meta:
        model = PaymentTerm
        fields = "__all__"
        widgets = {"due_date": DateInput}


class TaskForm(forms.ModelForm):
    def __init__(self, *args, **kwargs):
        super().__init__(*args, **kwargs)
        self.helper = ModalEditFormHelper()
        self.helper.layout = ModalEditLayout(
            "title",
            "assigned_to",
        )

    class Meta:
        model = Task
        fields = "__all__"
        widgets = {"assigned_to": autocomplete.ModelSelect2(url="user-autocomplete")}
