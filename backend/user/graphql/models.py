from django.contrib.auth import get_user_model

from graphene_django import DjangoObjectType


class User(DjangoObjectType):
    class Meta:
        model = get_user_model()
