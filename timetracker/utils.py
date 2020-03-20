from datetime import time, timedelta, date, datetime


def time2timedelta(t: time) -> timedelta:
    return timedelta(
        hours=t.hour,
        minutes=t.minute,
        seconds=t.second
    )


def week2date(year: int, week: int) -> date:
    return datetime.strptime(f'{year} {week} 1', '%Y %W %w').date()
