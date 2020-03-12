from django.apps import AppConfig
from django.utils.translation import gettext_lazy as _


class TimetrackerConfig(AppConfig):
    name = 'timetracker'
    verbose_name = _('Подсистема времени')
