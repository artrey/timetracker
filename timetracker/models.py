import uuid
from datetime import timedelta

from django.contrib.auth import get_user_model
from django.core.validators import MaxValueValidator
from django.db import models
from django.utils.translation import gettext_lazy as _

from timetracker.utils import time2timedelta


class BaseUuidModel(models.Model):
    class Meta:
        abstract = True

    id = models.UUIDField(
        primary_key=True,
        default=uuid.uuid4,
        editable=False,
        verbose_name=_('Уникальный идентификатор'),
    )


class Sector(models.Model):
    class Meta:
        verbose_name = _('направление')
        verbose_name_plural = _('направления')
        ordering = 'name',

    name = models.CharField(
        primary_key=True, max_length=64,
        verbose_name=_('Название'),
    )
    users = models.ManyToManyField(
        get_user_model(), related_name='sectors',
        verbose_name=_('Пользователи'), blank=True,
    )

    @property
    def projects_count(self) -> int:
        return self.projects.count()

    @property
    def full_name(self) -> str:
        return self.name

    def __str__(self) -> str:
        return self.full_name


class Project(BaseUuidModel):
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
    users = models.ManyToManyField(
        get_user_model(), related_name='projects',
        verbose_name=_('Пользователи'), blank=True,
    )

    @property
    def subsystems_count(self) -> int:
        return self.subsystems.count()

    @property
    def full_name(self) -> str:
        return f'{self.sector.full_name} / {self.name}'

    def __str__(self) -> str:
        return self.full_name


class Subsystem(BaseUuidModel):
    class Meta:
        verbose_name = _('подсистема')
        verbose_name_plural = _('подсистемы')
        ordering = 'name',

    name = models.CharField(
        max_length=64, verbose_name=_('Название'),
    )
    project = models.ForeignKey(
        Project, on_delete=models.CASCADE,
        related_name='subsystems',
        verbose_name=_('Проект'),
    )
    users = models.ManyToManyField(
        get_user_model(), related_name='subsystems',
        verbose_name=_('Пользователи'), blank=True,
    )

    @property
    def activities_count(self) -> int:
        return self.activities.count()

    @property
    def full_name(self) -> str:
        return f'{self.project.full_name} / {self.name}'

    def __str__(self) -> str:
        return self.full_name


class WorkDay(BaseUuidModel):
    class Meta:
        verbose_name = _('рабочий день')
        verbose_name_plural = _('рабочие дни')
        ordering = 'day', 'start', 'finish',

    day = models.DateField(verbose_name=_('День'))
    start = models.TimeField(verbose_name=_('Начало'))
    finish = models.TimeField(verbose_name=_('Конец'))
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
    def duration(self) -> timedelta:
        return time2timedelta(self.finish) - time2timedelta(self.start)

    @property
    def activities_count(self) -> int:
        return self.activities.count()

    def __str__(self) -> str:
        return f'{self.user} | {self.day} {self.start}-{self.finish}'


class Activity(BaseUuidModel):
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
    subsystem = models.ForeignKey(
        Subsystem, on_delete=models.CASCADE,
        related_name='activities',
        verbose_name=_('Подсистема'),
    )
    created_at = models.DateTimeField(
        auto_now_add=True,
        verbose_name=_('Время создания'),
    )

    @property
    def hours(self) -> int:
        return self.time.total_seconds() // 3600

    @property
    def minutes(self) -> int:
        return self.time.total_seconds() % 3600 // 60

    def __str__(self) -> str:
        return f'{self.work_day} | {self.time} of {self.work_day.duration}'
