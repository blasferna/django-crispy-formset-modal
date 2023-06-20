from extra_views import InlineFormSetFactory

from demo.bootstrap4.forms import TaskForm
from demo.models import Task


class TaskInline(InlineFormSetFactory):
    model = Task
    form_class = TaskForm
    fields = ["title", "assigned_to"]
    factory_kwargs = {"extra": 0}
