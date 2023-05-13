from crispy_forms.layout import LayoutObject, Field, Div, Layout as CrispyLayout
from django.template.loader import render_to_string
from django.conf import settings
from django.forms.formsets import DELETION_FIELD_NAME
from django.forms.utils import pretty_name
from django import forms


class ModalEditLayout(CrispyLayout):
    def __init__(self, *fields):
        self.fields = list(fields + (Div(Field("DELETE", css_class="formset-delete"), css_class="d-none"),))


class ModalEditFormsetLayout(LayoutObject):
    template = 'crispy_formset_modal/{template_pack}/table.html'

    def __init__(self, formset_name, list_display=[], sum_columns=[]):
        self.formset_name = formset_name
        self.list_display = list_display
        self.sum_columns = sum_columns

    def get_headers(self, empty_form):
        html_name = lambda x: empty_form[x].html_name.split("__prefix__")[1][1:]
        has_summary = lambda x: x in self.sum_columns
        fields = empty_form.fields
        # id, delete and hidden fields are excluded by the default list display fields
        list_display = [
            {
                "field": html_name(k),
                "title": pretty_name(k) if v.label is None else v.label,
                "type": self._get_field_type(v),
                "has_summary": has_summary(k)
            }
            for k, v in fields.items()
            if k not in ("id", DELETION_FIELD_NAME)
            and getattr(v.widget, "input_type", None) != "hidden"
        ]
        if not self.list_display:
            return list_display
        return [
            {
                "field": html_name(field),
                "title": pretty_name(field)
                if fields.get(field).label is None
                else fields.get(field).label,
                "type": self._get_field_type(fields.get(field)),
                "has_summary": has_summary(field)
            }
            for field in self.list_display
            if field not in ("id", DELETION_FIELD_NAME)
            and getattr(fields.get(field).widget, "input_type", None) != "hidden"
        ]

    def _get_field_type(self, field):
        _type = "text"
        if isinstance(field, forms.DecimalField):
            _type = "numeric"
        if isinstance(field, forms.FloatField):
            _type = "numeric"
        if isinstance(field, forms.IntegerField):
            _type = "numeric"
        if isinstance(field, forms.BooleanField):
            _type = "bool"
        if isinstance(field, forms.DateField):
            _type = "date"
        return _type

    def render(self, form, form_style, context, template_pack=settings.CRISPY_TEMPLATE_PACK):
        #form.helper.disable_csrf = True
        #form.helper.form_tag = False
        #form.helper.include_media = False
        #print(form.helper.layout.fields)
        formset = None
        view = context.get("view")
        inlines = context.get("inlines", [])
 
        i = 0
        for inline in view.inlines:
            if inline.__name__ == self.formset_name:
                formset = inlines[i]
            i += 1

        context.update({
            'formset': formset,
            'list_display': self.list_display,
            'headers': self.get_headers(formset.empty_form),
            'has_footer': len(self.sum_columns)>0,
            "form_template_name": f"crispy_formset_modal/{template_pack}/form.html",
            "modal_template_name": f"crispy_formset_modal/{template_pack}/modal.html",
        })

        template = self.template.format(template_pack=template_pack)
        return render_to_string(template, context.flatten())
