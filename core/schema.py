import graphene
from user import graphql as user
from timetracker import graphql as timetracker

queries = [
    timetracker.Query,
]

mutations = [
    user.AuthMutations,
]


class Queries(*queries):
    pass


class Mutations(*mutations):
    pass


schema = graphene.Schema(query=Queries, mutation=Mutations)
