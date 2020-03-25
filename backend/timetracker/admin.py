from abc import ABC
from datetime import date

from django.contrib import admin
from django.contrib.admin.options import BaseModelAdmin
from django.contrib.auth import get_user_model
from django.utils.translation import gettext_lazy as _

from timetracker import models


def custom_titled_filter(title):
    class Wrapper(admin.FieldListFilter, ABC):
        def __new__(cls, *args, **kwargs):
            instance = admin.FieldListFilter.create(*args, **kwargs)
            instance.title = title
            return instance
    return Wrapper


class PrefetchQuerysetMixin(BaseModelAdmin):
    prefetch_fields = {}
    prefetch_related = ()

    def get_field_queryset(self, db, db_field, request):
        qs = super().get_field_queryset(db, db_field, request)
        prefetched = self.prefetch_fields.get(db_field.name)

        if not qs and not prefetched:
            return None

        if not qs:
            qs = db_field.remote_field.model._default_manager.using(db)

        if prefetched:
            qs = qs.prefetch_related(*prefetched)

        return qs

    def get_queryset(self, request):
        qs = super().get_queryset(request)
        if self.prefetch_related:
            qs = qs.prefetch_related(*self.prefetch_related)
        return qs


class ProjectInline(PrefetchQuerysetMixin, admin.TabularInline):
    model = models.Project
    extra = 0
    filter_horizontal = 'users',
    prefetch_related = ('sector',)


class SubsystemInline(PrefetchQuerysetMixin, admin.TabularInline):
    model = models.Subsystem
    extra = 0
    filter_horizontal = 'users',
    prefetch_related = ('project', 'project__sector',)


class BaseAdmin(PrefetchQuerysetMixin, admin.ModelAdmin):
    pass


@admin.register(models.Sector)
class SectorAdmin(BaseAdmin):
    filter_horizontal = 'users',
    inlines = ProjectInline,

    prefetch_fields = {
        'users': ('sectors__projects',),
    }


@admin.register(models.Project)
class ProjectAdmin(BaseAdmin):
    list_display = 'name', 'sector',
    list_filter = 'sector',
    filter_horizontal = 'users',
    inlines = SubsystemInline,

    prefetch_related = ('sector',)


@admin.register(models.Subsystem)
class SubsystemAdmin(BaseAdmin):
    list_display = 'name', 'project_name', 'sector',
    list_filter = 'project__sector', \
                  ('project__name', custom_titled_filter('Проект')),
    filter_horizontal = 'users',

    prefetch_fields = {
        'project': ('sector',),
    }
    prefetch_related = ('project', 'project__sector',)

    def sector(self, obj: models.Subsystem) -> models.Sector:
        return obj.project.sector
    sector.short_description = _('направление')
    sector.admin_order_field = 'project__sector'

    def project_name(self, obj: models.Subsystem) -> str:
        return obj.project.name
    project_name.short_description = _('проект')
    project_name.admin_order_field = 'project__name'


@admin.register(models.WorkDay)
class WorkDayAdmin(BaseAdmin):
    list_display = 'user', 'day', 'start', 'finish',
    list_filter = 'user',

    prefetch_fields = {
        'work_day': ('user',),
    }
    prefetch_related = ('user',)


@admin.register(models.Activity)
class ActivityAdmin(BaseAdmin):
    list_display = 'user', 'day', 'time', 'created_at',
    list_filter = 'work_day__day', 'work_day__user',

    prefetch_fields = {
        'work_day': ('user',),
        'subsystem': ('users', 'project', 'project__sector')
    }
    prefetch_related = ('work_day__user',)

    def user(self, obj: models.Activity) -> get_user_model():
        return obj.work_day.user
    user.short_description = _('пользователь')
    user.admin_order_field = 'work_day__user'

    def day(self, obj: models.Activity) -> date:
        return obj.work_day.day
    day.short_description = _('день')
    day.admin_order_field = 'work_day__day'
