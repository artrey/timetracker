import graphene
from user import graphql as user
from timetracker import graphql as timetracker

queries = [
    user.Queries,
    timetracker.Queries,
]

mutations = [
    user.AuthMutations,
    timetracker.Mutations,
]


class Queries(*queries):
    pass


class Mutations(*mutations):
    pass


schema = graphene.Schema(query=Queries, mutation=Mutations)
