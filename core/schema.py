import graphene
from timetracker import graphql as timetracker

queries = [
    timetracker.Query,
]


class Queries(*queries):
    pass


schema = graphene.Schema(query=Queries)
