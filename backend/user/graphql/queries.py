import graphene
from graphql_jwt.decorators import login_required

from user.graphql import models as ql_models


class Queries(graphene.ObjectType):
    me = graphene.Field(ql_models.User)

    @login_required
    def resolve_me(self, info):
        return info.context.user
