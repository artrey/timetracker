from datetime import date

from django.contrib import admin
from django.contrib.auth import get_user_model
from django.utils.translation import gettext_lazy as _

from timetracker import models


class ProjectInline(admin.TabularInline):
    model = models.Project
    extra = 0
    filter_horizontal = 'users',


class SubsystemInline(admin.TabularInline):
    model = models.Subsystem
    extra = 0
    filter_horizontal = 'users',


@admin.register(models.Sector)
class SectorAdmin(admin.ModelAdmin):
    filter_horizontal = 'users',
    inlines = ProjectInline,


@admin.register(models.Project)
class ProjectAdmin(admin.ModelAdmin):
    list_display = 'name', 'sector',
    list_filter = 'sector',
    filter_horizontal = 'users',
    inlines = SubsystemInline,


@admin.register(models.Subsystem)
class SubsystemAdmin(admin.ModelAdmin):
    list_display = 'name', 'project_name', 'sector',
    list_filter = 'project__name', 'project__sector',
    filter_horizontal = 'users',

    def sector(self, obj: models.Subsystem) -> models.Sector:
        return obj.project.sector
    sector.short_description = _('направление')
    sector.admin_order_field = 'project__sector'

    def project_name(self, obj: models.Subsystem) -> str:
        return obj.project.name
    project_name.short_description = _('проект')
    project_name.admin_order_field = 'project__name'


@admin.register(models.WorkDay)
class WorkDayAdmin(admin.ModelAdmin):
    list_display = 'user', 'day', 'start', 'finish',
    list_filter = 'user',


@admin.register(models.Activity)
class ActivityAdmin(admin.ModelAdmin):
    list_display = 'user', 'time', 'day', 'created_at',
    list_filter = 'work_day__user', 'work_day__day',

    def user(self, obj: models.Activity) -> get_user_model():
        return obj.work_day.user
    user.short_description = _('пользователь')
    user.admin_order_field = 'work_day__user'

    def day(self, obj: models.Activity) -> date:
        return obj.work_day.day
    user.short_description = _('день')
    user.admin_order_field = 'work_day__day'
