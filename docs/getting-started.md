# Getting Started with Django Crispy Formset Modal

Now that you've successfully installed Django Crispy Formset Modal, let's walk through the basic usage and configuration of the package. This will cover defining the necessary forms and views in your Django project.


## Step 1: Define Your Models

As a starting point, you will need to have your Django models defined. Here's an example using `Invoice` and `InvoiceItem` models:

```python
from django.db import models

class Invoice(models.Model):
    invoice_number = models.CharField(max_length=100)
    date = models.DateField()
    client = models.CharField(max_length=255)

    def __str__(self):
        return self.invoice_number

class InvoiceItem(models.Model):
    invoice = models.ForeignKey(Invoice, on_delete=models.CASCADE)
    description = models.CharField(max_length=255)
    quantity = models.IntegerField()
    unit_price = models.DecimalField(max_digits=10, decimal_places=2)

    def __str__(self):
        return self.description
```

In this example, an `Invoice` can have multiple `InvoiceItems`.


## Step 2: Define Your Forms

The next step is to define the forms for your models. You will need to create a form for each model that you want to use with Django Crispy Formset Modal. Here's how you can define them for the `Invoice` and `InvoiceItem` models:

```python
from django import forms

from crispy_formset_modal.helper import ModalEditFormHelper
from crispy_formset_modal.layout import ModalEditLayout
from your_app.models import InvoiceItem


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
```

```python
from crispy_forms.helper import FormHelper
from crispy_forms.layout import Column, Fieldset, Layout, Row, Submit
from django import forms

from crispy_formset_modal.layout import ModalEditFormsetLayout
from your_app.models import Invoice
from your_app.forms import InvoiceItemForm


class InvoiceForm(forms.ModelForm):
    def __init__(self, *args, **kwargs):
        super().__init__(*args, **kwargs)
        self.helper = FormHelper()
        self.helper.layout = Layout(
            Row(Column("invoice_number"), Column("date")),
            "client",
            Fieldset(
                "Items",
                ModalEditFormsetLayout(
                    "InvoiceItemInline",
                    list_display=["description", "quantity", "unit_price"],
                ),
            ),
            Submit("submit", "Save", css_class="btn btn-primary float-right"),
        )

    class Meta:
        model = Invoice
        fields = "__all__"
```

The `ModalEditFormsetLayout` allows you to define which inline formset should be displayed as a modal.

## Step 3: Define Your Views

The final step in setting up Django Crispy Formset Modal is defining your views. Here's how you can define a `view` for creating an `Invoice`:

```python
from extra_views import CreateWithInlinesView
from your_app.models import Invoice
from your_app.forms import InvoiceForm, InvoiceItemForm

class InvoiceItemInline(InlineFormSetFactory):
    model = InvoiceItem
    form_class = InvoiceItemForm
    fields = ["description", "quantity", "unit_price"]
    factory_kwargs = {"extra": 0}

class CreateInvoiceView(CreateWithInlinesView):
    model = Invoice
    inlines = [InvoiceItemInline]
    form_class = InvoiceForm
```

With these steps, you are now ready to start using Django Crispy Formset Modal in your Django project. In the next section, we'll cover more advanced usage of the package.
