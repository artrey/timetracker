from django.utils.translation import gettext_lazy as _

import graphene
from graphql_jwt.decorators import login_required

from timetracker.graphql import models as ql_models
from timetracker import models


class Query(graphene.ObjectType):
    sectors = graphene.List(ql_models.Sector, description=_('Список направлений'))

    @login_required
    def resolve_sectors(self, info):
        return models.Sector.objects.all()
