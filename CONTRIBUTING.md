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

## Local Development Setup

> Tested on macOS / Linux. Windows users can follow the same steps in *PowerShell*.

```bash
# 1. Fork + clone
git clone https://github.com/<your-username>/minglemap.git
cd minglemap

# 2. Create Python virtual environment (require ≥3.10)
python -m venv .venv
source .venv/bin/activate  # Windows: .venv\\Scripts\\activate

# 3. Install dev requirements
pip install -r requirements-dev.txt

# 4. Install pre-commit hooks (auto-format & lint)
pre-commit install

# 5. Run the test suite to verify everything is green
pytest
```
