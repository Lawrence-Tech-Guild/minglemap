![CI](https://github.com/Lawrence-Tech-Guild/minglemap/actions/workflows/ci.yml/badge.svg)

![CI](https://github.com/Lawrence-Tech-Guild/minglemap/actions/workflows/ci.yml/badge.svg)

> 🍺 **Community Draft • Lawrence Tech Guild**
> First discussion: **21 May 2025 (beer meetup)**.
> Vision & maintainers will be hammered out in LTG Slack: `#minglemap`.
> Need an invite? See `COMMUNITY.md`.

# MingleMap 🚦

*A community‑driven idea for smarter in‑person networking.*

---

## Why MingleMap?

![Radar-style preview of MingleMap showing nearby attendees](docs/images/minglemap_preview.png)

MingleMap aims to transform how tech workers in Lawrence, Kansas (and beyond) connect at social and professional events. We want to remove the awkwardness of traditional name tags and foster authentic interactions by using smart technology and thoughtful design.

---

## Current Status

**Pre‑prototype** – We are gathering community input, use cases, and design concepts. Join us in shaping the vision!

Want to help? Skip to **Contributing** below.

---

## Quick Start

Choose the setup that suits you. **Option A (Docker)** is the fastest way to get a local instance running in under five minutes. **Option B (Python virtual environment)** is still available for those who prefer a classic dev setup.

### Option A – Docker (recommended)

#### Prerequisites

* **Docker Desktop** (Windows 11/macOS) or **Docker Engine 20.10+** with the **Compose plugin** (Linux).

  * **Windows** – Docker Desktop automatically enables WSL 2 the first time you run it.
  * **macOS** – Download Docker Desktop from [https://www.docker.com](https://www.docker.com).
  * **Ubuntu 22.04** –

    ```bash
    sudo apt-get update
    sudo apt-get install docker.io docker-compose-plugin
    sudo usermod -aG docker $USER   # log out & back in
    ```
* **Git** – to clone the repository.

#### Run MingleMap

```bash
# 1 – Clone the repo
git clone https://github.com/Lawrence-Tech-Guild/minglemap.git
cd minglemap

# 2 – Build and start the stack (first run takes ±2 min)
docker compose up -d   # -d = detached; skip it if you want to watch logs

# 3 – Open the site
# Linux/WSL/macOS: http://localhost:8000
# Windows (WSL 2 paths work out of the box): http://localhost:8000
```

**Stop the stack**

```bash
docker compose down   # add -v to drop database/redis volumes
```

**Live reload** – Source code is bind‑mounted, so any change you make on the host triggers Django’s auto‑reload in the running container.

### Option B – Python virtual environment (advanced)

```bash
# 1 – Clone the repo
git clone https://github.com/Lawrence-Tech-Guild/minglemap.git
cd minglemap

# 2 – Create & activate a virtual environment
python3 -m venv .venv
source .venv/bin/activate       # Windows: .venv\Scripts\activate

# 3 – Install package in editable mode with dev tools
pip install -e .[dev]

# 4 – Run the stub CLI or Django server
minglemap                 # CLI hello world
minglemap runserver       # Django dev server (auto‑reload)
```

---

## About Lawrence Tech Guild

MingleMap is a collaborative exploration inspired by **Lawrence Tech Guild**, a grassroots organisation that brings tech workers together for networking and community‑building events in Lawrence, Kansas.

* Share local or remote job opportunities.
* Plan meetups and tech‑oriented social events.
* Connect with experts for advice and collaboration.

> **Connect. Make friends. Come to Tech Guild.**

Interested? Ask a Tech Guild admin to join the Slack workspace or mailing list, and let’s keep growing a useful, engaging tech community!

---

## Contributing

We warmly welcome both seasoned developers and first‑time open‑source contributors.

* Check out the [`docs/`](./docs/) directory for current ideas and designs.
* Pick an issue tagged **good first issue** to get started.
* Join the conversation in GitHub Issues or the Lawrence Tech Guild Slack.

Let’s make networking smarter – together!
