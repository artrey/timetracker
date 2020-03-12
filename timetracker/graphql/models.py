from graphene_django import DjangoObjectType

from timetracker import models


class Sector(DjangoObjectType):
    class Meta:
        model = models.Sector


class Project(DjangoObjectType):
    class Meta:
        model = models.Project


class Subsystem(DjangoObjectType):
    class Meta:
        model = models.Subsystem
