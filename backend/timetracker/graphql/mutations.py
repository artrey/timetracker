import datetime

from django.utils.translation import gettext_lazy as _
import graphene
from graphql_jwt.decorators import login_required

from timetracker import models
from timetracker.graphql import models as ql_models
from timetracker.utils import time2timedelta


class UpdateWorkDay(graphene.Mutation):
    class Arguments:
        day = graphene.Date(description=_('День'), required=True)
        start = graphene.Time(description=_('Время начала'), required=True)
        finish = graphene.Time(description=_('Время окончания'), required=True)

    work_day = graphene.Field(ql_models.WorkDay)

    @login_required
    def mutate(self, info, day: datetime.date, start: datetime.time,
               finish: datetime.time, **inputs):
        work_day, _ = models.WorkDay.objects.update_or_create(
            day=day, user=info.context.user,
            defaults={
                'start': start,
                'finish': finish,
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

    @login_required
    def mutate(self, info, work_day: str, subsystem: str,
               time: datetime.time, **inputs):
        activity, _ = models.Activity.objects.update_or_create(
            id=inputs.get('uid'), work_day__user=info.context.user,
            defaults={
                'time': time2timedelta(time),
                'work_day_id': work_day,
                'subsystem_id': subsystem,
                'comment': inputs.get('comment')
            }
        )
        return UpdateActivity(activity=activity)


class RemoveActivity(graphene.Mutation):
    class Arguments:
        id = graphene.UUID(
            description=_('Уникальный идентификатор'),
            required=True
        )

    id = graphene.UUID()

    @login_required
    def mutate(self, info, id: str, **inputs):
        activity = models.Activity.objects.filter(
            id=id, work_day__user=info.context.user
        ).first()
        if activity:
            activity.delete()
        return RemoveActivity(id=id if activity else None)


class Mutations(graphene.ObjectType):
    update_work_day = UpdateWorkDay.Field()
    update_activity = UpdateActivity.Field()
    remove_activity = RemoveActivity.Field()
