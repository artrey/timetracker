import csv
import datetime

from django.contrib.auth.decorators import user_passes_test
from django.http import HttpResponse, Http404

from timetracker.report import make_weekly_report_data, make_monthly_report_data
from timetracker.utils import week2date, month2date, timedelta2str

REPORT_ENGINES = {
    'weekly': make_weekly_report_data,
    'monthly': make_monthly_report_data,
}


@user_passes_test(lambda u: u.is_superuser)
def report_view(request, since: datetime.date, to: datetime.date, mode: str):
    if since > to:
        raise Http404('Incorrect since-to pair')

    if mode not in REPORT_ENGINES:
        raise Http404('Incorrect mode')

    fieldnames, data = REPORT_ENGINES[mode](since, to)

    response = HttpResponse(content_type='text/csv')
    report_name = f'report-{since.strftime("%Y%m%d")}-{to.strftime("%Y%m%d")}'
    response['Content-Disposition'] = f'attachment;filename="{report_name}.csv"'
    writer = csv.DictWriter(
        response, delimiter=',', fieldnames=fieldnames
    )
    writer.writeheader()
    writer.writerows(data)
    return response


@user_passes_test(lambda u: u.is_superuser)
def report_weekly_view(request, year: int, week: int):
    start = week2date(year, week - 1)
    return report_view(
        request, start, start + datetime.timedelta(days=6), 'weekly'
    )


@user_passes_test(lambda u: u.is_superuser)
def report_monthly_view(request, year: int, month: int):
    start = month2date(year, month)
    if month >= 12:
        year += 1
        month = 0
    end = month2date(year, month + 1) - datetime.timedelta(days=1)
    return report_view(request, start, end, 'monthly')
