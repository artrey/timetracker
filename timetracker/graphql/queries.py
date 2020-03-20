from datetime import timedelta

from django.db.models import Q
from django.utils.translation import gettext_lazy as _
import graphene
from graphql_jwt.decorators import login_required

from timetracker.graphql import models as ql_models
from timetracker import models
from timetracker.utils import week2date


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

    week = graphene.Field(
        ql_models.Week,
        year=graphene.Int(required=True, description=_('Год')),
        week=graphene.Int(required=True, description=_('Неделя')),
        description=_('Список дней на неделе')
    )

    # @login_required
    def resolve_week(self, info, year: int, week: int):
        user = info.context.user
        dt = week2date(year, week - 1)
        return ql_models.Week(dt, models.WorkDay.objects.filter(
            day__gte=dt, day__lt=dt + timedelta(days=7), user=user
        ))
