from django.utils.translation import gettext_lazy as _
import graphene
from graphql_jwt.decorators import login_required

from timetracker.graphql import models as ql_models


class AddActivity(graphene.Mutation):
    class Arguments:
        work_day = graphene.UUID(description=_('Рабочий день'), required=True)
        subsystem = graphene.UUID(description=_('Подсистема'), required=True)
        time = graphene.Time(description=_('Длительность'), required=True)
        comment = graphene.String(description=_('Комментарий'))

    activity = graphene.Field(ql_models.Activity)

    @login_required
    def mutate(self, info, work_day, subsystem, time, **inputs):
        user = info.context.user
        comment = inputs.get('comment', None)

        print(user, work_day, subsystem, time, comment)

        return AddActivity(activity=None)


class Mutations(graphene.ObjectType):
    add_activity = AddActivity.Field()
