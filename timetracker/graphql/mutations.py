import datetime

from django.utils.translation import gettext_lazy as _
import graphene
from graphql_jwt.decorators import login_required

from timetracker import models
from timetracker.graphql import models as ql_models, Queries
from timetracker.utils import time2timedelta


class CreateDefaultOrGetWorkDays(graphene.Mutation):
    class Arguments:
        since = graphene.Date(description=_('Начало'), required=True)
        to = graphene.Date(description=_('Конец'), required=True)

    work_days = graphene.List(ql_models.WorkDay, description=_('Рабочие дни'))

    # @login_required
    def mutate(self, info, since: datetime.date, to: datetime.date):
        user = info.context.user
        dt = since
        while dt <= to:
            obj, _ = models.WorkDay.objects.get_or_create(
                day=dt, user=user, defaults={
                    'start': datetime.time(),
                    'finish': datetime.time(),
                }
            )
            dt += datetime.timedelta(days=1)

        return CreateDefaultOrGetWorkDays(
            work_days=Queries().resolve_work_days(info, since, to)
        )


class UpdateWorkDay(graphene.Mutation):
    class Arguments:
        day = graphene.Date(description=_('День'), required=True)
        start = graphene.Time(description=_('Время начала'), required=True)
        finish = graphene.Time(description=_('Время окончания'), required=True)

    work_day = graphene.Field(ql_models.WorkDay)

    # @login_required
    def mutate(self, info, day: datetime.date, start: datetime.time,
               finish: datetime.time, **inputs):
        work_day, _ = models.WorkDay.objects.update_or_create(
            day=day,
            defaults={
                'start': start,
                'finish': finish,
                'user': info.context.user
            }
        )
        return UpdateWorkDay(work_day=work_day)


class UpdateActivity(graphene.Mutation):
    class Arguments:
        work_day = graphene.UUID(description=_('Рабочий день'), required=True)
        subsystem = graphene.UUID(description=_('Подсистема'), required=True)
        time = graphene.Time(description=_('Длительность'), required=True)
        comment = graphene.String(description=_('Комментарий'))
        uid = graphene.UUID(
            description=_('Уникальный идентификатор (для изменения)')
        )

    activity = graphene.Field(ql_models.Activity)

    # @login_required
    def mutate(self, info, work_day: str, subsystem: str,
               time: datetime.time, **inputs):
        activity, _ = models.Activity.objects.update_or_create(
            id=inputs.get('uid'),
            defaults={
                'time': time2timedelta(time),
                'work_day_id': work_day,
                'subsystem_id': subsystem,
                'comment': inputs.get('comment')
            }
        )
        return UpdateActivity(activity=activity)


class Mutations(graphene.ObjectType):
    update_work_day = UpdateWorkDay.Field()
    update_activity = UpdateActivity.Field()
    create_default_or_get_work_days = CreateDefaultOrGetWorkDays.Field()
