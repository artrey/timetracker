from django.contrib import admin
from django.utils.translation import gettext_lazy as _


class AdminSite(admin.AdminSite):
    site_header = _('Sim-Lab Time Tracker')
    site_title = _('Sim-Lab Time Tracker')
    index_title = _('Страница конфигурации')
