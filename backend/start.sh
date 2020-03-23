#!/bin/sh

python3 manage.py migrate
gunicorn core.wsgi -w 4 -t 600 -b 0.0.0.0:8000
