import datetime

from django.contrib.auth import get_user_model
from django.db.models import Prefetch, Sum

from timetracker.models import WorkDay
from timetracker.utils import time_diff, timedelta2str


def make_weekly_report_data(since: datetime.date,
                            to: datetime.date) -> (list, list):
    data = []

    for staff in get_user_model().objects.prefetch_related(
        Prefetch('work_days', WorkDay.objects.filter(
            day__gte=since, day__lte=to
        ).prefetch_related('activities')),
    ).order_by('last_name', 'first_name'):

        user_info = {'Сотрудник': staff.get_report_name()}
        total_office_time = datetime.timedelta(0)
        total_work_time = datetime.timedelta(0)
        extra_rows = []

        for wd in staff.work_days.all():
            activities = list(wd.activities.all())

            office_time = time_diff(wd.finish, wd.start)
            work_time = sum(
                map(lambda x: x.time, activities),
                datetime.timedelta(0)
            )

            total_office_time += office_time
            total_work_time += work_time

            cur_day = wd.day.strftime('%Y-%m-%d')
            user_info[cur_day] = \
                f'{timedelta2str(office_time)} / {timedelta2str(work_time)}'

            for a in activities:
                for row in extra_rows:
                    if cur_day not in row:
                        row.update({
                            cur_day: f'{timedelta2str(a.time)} - '
                                     f'{a.subsystem.project.name} - '
                                     f'{a.subsystem.name}'
                        })
                        break
                else:
                    extra_rows.append({
                        cur_day: f'{timedelta2str(a.time)} - '
                                 f'{a.subsystem.project.name} - '
                                 f'{a.subsystem.name}'
                    })

        user_info.update({
            'Время в офисе': timedelta2str(total_office_time),
            'Рабочее время': timedelta2str(total_work_time),
        })

        data.append(user_info)
        if extra_rows:
            data += extra_rows

    fieldnames = ['Сотрудник']
    dt = since
    while dt <= to:
        fieldnames.append(dt.strftime('%Y-%m-%d'))
        dt += datetime.timedelta(days=1)
    fieldnames += ['Время в офисе', 'Рабочее время']

    return fieldnames, data


def make_monthly_report_data(since: datetime.date,
                             to: datetime.date) -> (list, list):
    query = get_user_model().objects.filter(
        work_days__activities__isnull=False,
        work_days__day__gte=since,
        work_days__day__lte=to,
    ).annotate(
        work_time=Sum('work_days__activities__time'),
    ).order_by('last_name', 'first_name').values(
        'username', 'last_name', 'first_name', 'work_time',
        'work_days__activities__subsystem__project__name',
    )

    data = []
    projects = set()

    for record in query:
        work_time = record.get('work_time') or datetime.timedelta(0)
        project = record.get('work_days__activities__subsystem__project__name')
        staff = f'{record.get("last_name")} {record.get("first_name")}'

        for row in data:
            if staff == row['Сотрудник']:
                row[project] = work_time
                break
        else:
            data.append({
                'Сотрудник': staff,
                project: work_time,
            })

        projects.add(project)

    fieldnames = ['Сотрудник'] + list(sorted(projects))

    result = {p: sum([r.get(p, datetime.timedelta(0)) for r in data],
                     datetime.timedelta(0)) for p in projects}
    result['Сотрудник'] = 'СУММА'
    data.append(result)
    
    for f in fieldnames[1:]:
        for row in data:
            if f in row:
                row[f] = timedelta2str(row[f])

    return fieldnames, data
