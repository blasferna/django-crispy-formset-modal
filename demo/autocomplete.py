from dal import autocomplete
from django.contrib.auth.models import User


class UserAutocomplete(autocomplete.Select2QuerySetView):
    def get_queryset(self):
        qs = User.objects.all()

        if self.q:
            qs = qs.filter(username__contains=self.q)

        return qs
