import inspect

import markdown
from django.conf import settings
from django.forms.widgets import MediaDefiningClass
from extra_views import SuccessMessageMixin


class DemoViewMixin(SuccessMessageMixin, metaclass=MediaDefiningClass):
    title = ""
    success_message = "Record successfully created!"
    template_pack = ""
    template_name = "demo.html"
    index_url = ""

    def get_context_data(self, **kwargs):
        context = super().get_context_data(**kwargs)
        context["class_name"] = self.__class__.__name__
        context["docstring"] = self.get_docstring()
        context["title"] = self.title
        context["template_pack"] = self.template_pack
        context["index_url"] = self.index_url
        context["media"] = self.media
        return context

    def get_docstring(self):
        docstring = inspect.getdoc(self.__class__)
        if docstring is not None:
            return markdown.markdown(docstring, extensions=["extra"])
        else:
            return ""

    def get(self, request, *args, **kwargs):
        settings.CRISPY_TEMPLATE_PACK = self.template_pack
        return super().get(request, *args, **kwargs)
