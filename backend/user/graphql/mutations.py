import graphene
import graphql_jwt


class AuthMutations(graphene.ObjectType):
    login = graphql_jwt.ObtainJSONWebToken.Field()
