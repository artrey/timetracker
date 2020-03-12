from datetime import timedelta

from django.contrib.auth import get_user_model
from django.core.validators import MaxValueValidator
from django.db import models
from django.utils.translation import gettext_lazy as _


class Sector(models.Model):
    class Meta:
        verbose_name = _('направление')
        verbose_name_plural = _('направления')
        ordering = 'name',

    name = models.CharField(
        primary_key=True, max_length=64,
        verbose_name=_('Название'),
    )

    @property
    def projects_count(self) -> int:
        return self.projects.count()

    def __str__(self) -> str:
        return self.name


class Project(models.Model):
    class Meta:
        verbose_name = _('проект')
        verbose_name_plural = _('проекты')
        ordering = 'name',

    name = models.CharField(
        max_length=64, verbose_name=_('Название'),
    )
    sector = models.ForeignKey(
        Sector, on_delete=models.CASCADE,
        related_name='projects',
        verbose_name=_('Направление'),
    )

    @property
    def subsystems_count(self) -> int:
        return self.subsystems.count()

    def __str__(self) -> str:
        return self.name


class Subsystem(models.Model):
    class Meta:
        verbose_name = _('подсистема')
        verbose_name_plural = _('подсистемы')
        ordering = 'name',

    name = models.CharField(
        max_length=64, verbose_name=_('Название'),
    )
    sectors = models.ManyToManyField(
        Project, related_name='subsystems',
        verbose_name=_('Проекты'),
    )
    users = models.ManyToManyField(
        get_user_model(), related_name='subsystems',
        verbose_name=_('Пользователи'),
    )

    @property
    def sectors_count(self) -> int:
        return self.sectors.count()

    @property
    def work_days_count(self) -> int:
        return self.work_days.count()

    def __str__(self) -> str:
        return self.name


class WorkDay(models.Model):
    class Meta:
        verbose_name = _('рабочий день')
        verbose_name_plural = _('рабочие дни')
        ordering = 'day', 'start', 'finish',

    day = models.DateField(verbose_name=_('День'))
    start = models.TimeField(verbose_name=_('Начало'))
    finish = models.TimeField(verbose_name=_('Конец'))
    subsystem = models.ForeignKey(
        Subsystem, on_delete=models.CASCADE,
        related_name='work_days',
        verbose_name=_('Подсистема'),
    )
    user = models.ForeignKey(
        get_user_model(), on_delete=models.CASCADE,
        related_name='work_days',
        verbose_name=_('Пользователь'),
    )

    def save(self, force_insert=False, force_update=False,
             using=None, update_fields=None):
        if self.finish < self.start:
            raise ValueError(
                _('Время окончания должно быть больше времени начала')
            )
        super().save(force_insert, force_update, using, update_fields)

    @property
    def activities_count(self) -> int:
        return self.activities.count()

    def __str__(self) -> str:
        return f'{self.day} {self.start}-{self.finish}' \
               f' [{self.user} / {self.subsystem}]'


class Activity(models.Model):
    class Meta:
        verbose_name = _('деятельность')
        verbose_name_plural = _('деятельности')
        ordering = 'time', 'created_at',

    time = models.DurationField(
        verbose_name=_('Длительность'),
        validators=[MaxValueValidator(timedelta(hours=16))]
    )
    comment = models.TextField(
        verbose_name=_('Комментарий'),
        null=True, blank=True,
    )
    work_day = models.ForeignKey(
        WorkDay, on_delete=models.CASCADE,
        related_name='activities',
        verbose_name=_('Рабочий день'),
    )
    created_at = models.DateTimeField(
        auto_now_add=True,
        verbose_name=_('Время создания'),
    )

    def __str__(self) -> str:
        return f'{self.time} | {self.work_day}'
