from django import forms

from crispy_formset_modal.helper import ModalEditFormHelper
from crispy_formset_modal.layout import ModalEditLayout
from demo.models import InvoiceItem, PaymentTerm
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
