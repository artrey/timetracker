FROM python:3-alpine

LABEL maintainer="Alexander Ivanov <oz.sasha.ivanov@gmail.com>"

# System envoriments
ENV LANG=C.UTF-8 \
  PYTHONUNBUFFERED=1

RUN apk update && apk add --no-cache \
  postgresql-dev \
  gcc \
  python3-dev \
  musl-dev

WORKDIR /app

# Target requirements
COPY requirements.txt .

# Project's requirements
RUN pip3 install gunicorn
RUN pip3 install -r requirements.txt

# Target project
COPY . .
RUN chmod +x start.sh

RUN python3 manage.py collectstatic

EXPOSE 8000

CMD ["./start.sh"]
