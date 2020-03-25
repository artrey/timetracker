from django.contrib.auth.models import AbstractUser
from django.db import models
from django.utils.translation import gettext_lazy as _

from core.models import BaseUuidModel


class User(AbstractUser):
    pass


class Token(BaseUuidModel):
    class Meta:
        verbose_name = _('токен')
        verbose_name_plural = _('токены')

    name = models.CharField(
        max_length=64, verbose_name=_('Название'),
    )
    token = models.CharField(
        max_length=64, db_index=True,
        verbose_name=_('Токен'),
    )
