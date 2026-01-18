# ---- Base image ----
FROM python:3.12-slim

# ---- OS packages needed for psycopg2 + GeoDjango ----
RUN apt-get update \
       && apt-get install -y --no-install-recommends \
       build-essential libpq-dev gdal-bin git \
       && rm -rf /var/lib/apt/lists/*

# ---- Python deps ----
WORKDIR /app
COPY requirements.txt .
# RUN pip install --upgrade pip && pip install --no-cache-dir -r requirements.txt
RUN pip install --upgrade pip && PIP_REQUIRE_HASHES=0 pip install --no-cache-dir -r requirements.txt


# ---- Project code ----
COPY . /app

# ---- Runtime config ----
ENV PYTHONUNBUFFERED=1
ENV PYTHONUNBUFFERED=1
ENV PIP_ROOT_USER_ACTION=ignore
CMD ["daphne", "-b", "0.0.0.0", "-p", "8000", "minglemap.asgi:application"]
