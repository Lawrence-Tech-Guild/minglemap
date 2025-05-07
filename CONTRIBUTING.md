# Contributing to MingleMap

🌟 **Thanks for thinking about contributing!** Whether you’re filing a typo fix or a major feature, your help moves the project forward.
The sections below explain how to set up your environment, follow our style rules, and submit high-quality pull requests.

---

## Table of Contents

1. [Ground Rules](#ground-rules)
2. [How to Get Help or Discuss Ideas](#how-to-get-help-or-discuss-ideas)
3. [Local Development Setup](#local-development-setup)
4. [Branching & Commit Guidelines](#branching--commit-guidelines)
5. [Code Style & Tooling](#code-style--tooling)
6. [Running Tests](#running-tests)
7. [Writing / Updating Documentation](#writing--updating-documentation)
8. [Submitting a Pull Request](#submitting-a-pull-request)
9. [Reporting Bugs & Requesting Features](#reporting-bugs--requesting-features)
10. [Community Code of Conduct](#community-code-of-conduct)

---

## Ground Rules

| ✅ Do                                   | 🚫 Don’t                                              |
| -------------------------------------- | ----------------------------------------------------- |
| Be kind, inclusive, and patient.       | Use insulting, demeaning, or discriminatory language. |
| Keep discussions public when possible. | DM maintainers for non-private questions.             |
| Ask before you start a large refactor. | Surprise everyone with a 4 000-line PR.               |
| Write tests and docs for new code.     | Add code that only you understand.                    |

*Reminder: all participation is covered by our [Code of Conduct](CODE_OF_CONDUCT.md).*

---

## How to Get Help or Discuss Ideas

| Where                                                     | Use it for                                                             |
| --------------------------------------------------------- | ---------------------------------------------------------------------- |
| **GitHub Discussions**                                    | Open‑ended brainstorming and “How could we…?” questions.               |
| **GitHub Issues**                                         | Bug reports & concrete feature requests.                               |
| **Private Slack workspace**                               | Real‑time chat, quick help, informal Q\&A. Ask an admin for an invite. |
| **[conduct@minglemap.org](mailto:conduct@minglemap.org)** | Private or sensitive conduct concerns (CoC).                           |

## Local Development

> Tested on macOS/Linux. Windows PowerShell users can follow the same steps.

```bash
# 1. Fork & clone
git clone https://github.com/Lawrence-Tech-Guild/minglemap.git
cd minglemap

# 2. Create & activate a virtual environment (Python ≥3.10)
python3 -m venv .venv
# macOS/Linux
source .venv/bin/activate
# Windows PowerShell
# .\.venv\Scripts\Activate.ps1

# 3. Install the package in editable mode with dev tools
pip install -e '.[dev]'

# 4. Install & enable pre-commit hooks
pre-commit install

# 5. Run linters & formatters (as in CI)
pre-commit run --all-files

# 6. Run the test suite (as in CI)
pytest --maxfail=1 --disable-warnings -q

