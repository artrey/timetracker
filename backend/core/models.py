import uuid

from django.db import models
from django.utils.translation import gettext_lazy as _


class BaseUuidModel(models.Model):
    class Meta:
        abstract = True

    id = models.UUIDField(
        primary_key=True,
        default=uuid.uuid4,
        editable=False,
        verbose_name=_('Уникальный идентификатор'),
    )
