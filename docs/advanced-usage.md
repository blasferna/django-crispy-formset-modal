# Advanced Usage of Django Crispy Formset Modal

Django Crispy Formset Modal is not limited to basic usage. It provides additional features that make it suitable for more complex use-cases. This section covers some of these advanced features and demonstrates how to apply them.

## Multiple Inline Formsets

Django Crispy Formset Modal allows you to define a master form with multiple inline formsets. For example, consider a scenario where you want to register an invoice that includes not only multiple items but also multiple payment terms.

To achieve this, you would define additional `models`, `forms`, and inline `formsets` for the payment terms. Here's an example:


```python
# Models
class PaymentTerm(models.Model):
    invoice = models.ForeignKey(Invoice, on_delete=models.CASCADE)
    due_date = models.DateField()
    amount = models.DecimalField(max_digits=10, decimal_places=2)
    
# Forms
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

# Inline Formset
class PaymentTermInline(InlineFormSetFactory):
    model = PaymentTerm
    form_class = PaymentTermForm
    fields = ["due_date", "amount"]
    factory_kwargs = {"extra": 0}
```

Then, in your `view`, you would add this additional `inline` `formset` to the list of `inlines`:


```python
class CreateInvoiceView(CreateWithInlinesView):
    model = Invoice
    inlines = [InvoiceItemInline, PaymentTermInline]
    form_class = InvoiceForm
```

In your form layout, you would include a `ModalEditFormsetLayout` for this additional inline formset:

```python
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
            Fieldset(
                "Payment Terms",
                ModalEditFormsetLayout(
                    "PaymentTermInline",
                    list_display=["due_date", "amount"],
                ),
            ),
            Submit("submit", "Save", css_class="btn btn-primary float-right"),
        )

    class Meta:
        model = Invoice
        fields = "__all__"
```

## Column Summarizing

Django Crispy Formset Modal allows you to define numeric fields for totaling at the footer of the corresponding HTML table. This is useful when you want to display the total amount for specific fields.

For instance, in the `InvoiceItemForm`, if you want to display the total amount for the quantity and unit_price fields, you would define `sum_columns` in your `ModalEditFormsetLayout`:

```python
Fieldset(
    "Items",
    ModalEditFormsetLayout(
        "InvoiceItemInline",
        list_display=["description", "quantity", "unit_price"],
        sum_columns=["quantity", "unit_price"],
    ),
),
```

This configuration would add a row at the bottom of the table that displays the total quantity and unit_price for all items in the formset. The total is dynamically updated as the values in the formset change.


## Mass Deletion

Django Crispy Formset Modal supports the mass deletion of records from the HTML table. It generates a column with checkboxes for each row in the table. These checkboxes can be selected individually or all at once, and upon pressing the delete button, all selected records are removed. This feature does not require any additional configuration.


With these advanced features, Django Crispy Formset Modal offers flexible and powerful solutions for managing complex formsets in your Django projects. In the next section, we will cover customization options and how to adapt the package to fit your specific needs.
