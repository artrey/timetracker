from datetime import time, timedelta, date, datetime


def time2timedelta(t: time) -> timedelta:
    return timedelta(
        hours=t.hour,
        minutes=t.minute,
        seconds=t.second
    )


def time_diff(t1: time, t2: time) -> timedelta:
    td1 = time2timedelta(t1)
    td2 = time2timedelta(t2)
    return td2 - td1 if td2 > td1 else td1 - td2


def timedelta2str(t: timedelta) -> str:
    secs = t.total_seconds()
    return f'{int(secs // 3600):02}:{int(secs % 3600 // 60):02}'


def week2date(year: int, week: int) -> date:
    return datetime.strptime(f'{year} {week} 1', '%Y %W %w').date()


def month2date(year: int, month: int) -> date:
    return datetime.strptime(f'{year} {month}', '%Y %m').date()
