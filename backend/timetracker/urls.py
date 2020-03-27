from django.urls import path, register_converter

from timetracker.converters import DateConverter
from timetracker.views import (
    report_view,
    report_weekly_view,
    report_monthly_view,
)

register_converter(DateConverter, 'date')

urlpatterns = [
    path('report/<date:since>/<date:to>/<str:mode>/',
         report_view, name='report'),
    path('report/weekly/<int:year>/<int:week>/',
         report_weekly_view, name='report_weekly'),
    path('report/monthly/<int:year>/<int:month>/',
         report_monthly_view, name='report_monthly'),
]
