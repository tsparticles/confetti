**Note about Husky deprecation message**

You may see a message about Husky being deprecated in the repository when running git hooks locally. This repository intentionally keeps the simple `.husky/pre-commit` hook and a copy of the legacy helper script for compatibility with the installed Husky version.

If you prefer to update to the newest Husky invocation style, replace the hook content and remove the legacy helper script in `.husky/_/husky.sh`.
