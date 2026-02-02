---
name: Bug report
about: Create a report to help us improve
title: "[Bug] "
labels: bug
assignees: ""
---

## Description
A clear and concise description of what the bug is.

## Steps to reproduce
1.
2.
3.

## Expected behavior
What should happen?

## Actual behavior
What actually happens?

## Environment
- OS:
- Browser:
- Node version:
- Branch (main / v1 / v2 / v3):

## Logs / screenshots
Paste error messages or screenshots here.

## Notes
If the error is `Cannot read properties of undefined (reading 'map')` from `Select.tsx`, ensure:
- `options` defaults to `[]`
- OR the component renders `children` when provided
