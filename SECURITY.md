# Security Policy

## Reporting a vulnerability

This repository is public, but vulnerability details, credentials, tenant information, personal information, and access tokens must not be placed in a public issue or pull request.

Use GitHub's private vulnerability-reporting or security-advisory channel when enabled. Otherwise, contact the repository owner privately. Include the affected route or component, minimum reproduction steps, expected authorization boundary, observed behavior, impact, and a sanitized proof of concept.

Do not access or retain customer information beyond the minimum necessary to demonstrate the issue. Do not alter production records, send communications, initiate payments, or perform denial-of-service testing.

## Release requirements

Security fixes are developed through pull requests against `main`. Authentication, database, upload, payment, and administrative changes require negative authorization tests and a rollback plan. No secret or production environment file may be committed to the repository.
