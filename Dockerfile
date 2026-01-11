# ---- Base image ----
FROM python:3.12-slim

# ---- OS packages needed for psycopg2 + GeoDjango ----
RUN apt-get update \
 && apt-get install -y --no-install-recommends \
        build-essential libpq-dev gdal-bin \
 && rm -rf /var/lib/apt/lists/*

# ---- Python deps ----
WORKDIR /app
COPY requirements.txt .
RUN pip install --upgrade pip && pip install --no-cache-dir -r requirements.txt

# ---- Project code ----
COPY . /app

# ---- Runtime config ----
ENV PYTHONUNBUFFERED=1
CMD ["daphne", "-b", "0.0.0.0", "-p", "8000", "minglemap.asgi:application"]
