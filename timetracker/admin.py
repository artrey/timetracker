from django.contrib import admin

from timetracker import models


@admin.register(models.Sector)
class SectorAdmin(admin.ModelAdmin):
    pass


@admin.register(models.Project)
class ProjectAdmin(admin.ModelAdmin):
    pass


@admin.register(models.Subsystem)
class SubsystemAdmin(admin.ModelAdmin):
    pass


@admin.register(models.WorkDay)
class WorkDayAdmin(admin.ModelAdmin):
    pass


@admin.register(models.Activity)
class ActivityAdmin(admin.ModelAdmin):
    pass
