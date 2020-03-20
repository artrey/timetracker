import graphene
from graphene_django import DjangoObjectType

from timetracker import models


class Subsystem(graphene.ObjectType):
    id = graphene.UUID()
    full_name = graphene.String()


class WorkDay(DjangoObjectType):
    class Meta:
        model = models.WorkDay


class Activity(DjangoObjectType):
    class Meta:
        model = models.Activity
        exclude = 'time',

    hours = graphene.Int(source='hours')
    minutes = graphene.Int(source='minutes')
    subsystem = graphene.Field(Subsystem, source='subsystem')


class Week(graphene.ObjectType):
    first_day = graphene.Date()
    days = graphene.List(WorkDay)
