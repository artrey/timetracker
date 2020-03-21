import datetime
from datetime import timedelta

from django.db.models import Q
from django.utils.translation import gettext_lazy as _
import graphene
from graphql_jwt.decorators import login_required

from timetracker.graphql import models as ql_models
from timetracker import models
from timetracker.utils import week2date


def get_work_days(**filters):
    return models.WorkDay.objects.prefetch_related(
        'activities',
        'activities__subsystem',
        'activities__subsystem__project',
        'activities__subsystem__project__sector',
    ).filter(**filters)


class Queries(graphene.ObjectType):
    subsystems = graphene.List(
        ql_models.Subsystem,
        description=_('Список подсистем')
    )

    # @login_required
    def resolve_subsystems(self, info):
        user = info.context.user
        subsystems = list(models.Subsystem.objects.prefetch_related(
            'project__sector__users', 'project__users', 'users'
        ).filter(
            Q(project__sector__users=user) |
            Q(project__users=user) |
            Q(users=user)
        ).order_by('project__sector__name', 'project__name', 'name'))
        return [ql_models.Subsystem(id=s.id, full_name=s.full_name)
                for s in subsystems]

    work_day = graphene.Field(
        ql_models.WorkDay,
        day=graphene.Date(required=True, description=_('День')),
        description=_('Рабочий день')
    )

    # @login_required
    def resolve_work_day(self, info, day: datetime.date):
        user = info.context.user
        obj, _ = models.WorkDay.objects.get_or_create(
            day=day, user=user, defaults={
                'start': datetime.time(),
                'finish': datetime.time(),
            }
        )
        return obj

    work_days = graphene.List(
        ql_models.WorkDay,
        since=graphene.Date(required=True, description=_('Начало')),
        to=graphene.Date(required=True, description=_('Конец')),
        description=_('Список дней за период')
    )

    # @login_required
    def resolve_work_days(self, info, since: datetime.date, to: datetime.date):
        user = info.context.user
        return get_work_days(day__gte=since, day__lte=to, user=user)
