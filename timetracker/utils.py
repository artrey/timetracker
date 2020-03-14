from datetime import time, timedelta


def time2timedelta(t: time) -> timedelta:
    return timedelta(
        hours=t.hour,
        minutes=t.minute,
        seconds=t.second
    )
